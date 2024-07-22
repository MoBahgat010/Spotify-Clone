import { useDispatch, useSelector } from "react-redux";
import TrackView from "../TrackView/TrackView";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { hideCreatePlayListComponent } from "../../RTK/Slices/ComponentsSlices";

function CreatePlayList(props) {

    const { createPlayListComponent } = useSelector(state => state.Dahboardlayout);
    const { addedTracks } = useSelector(state => state.playListAdd);
    const SearchInp = useRef();
    const [searchResult, setSearchResult] = useState([]);

    const dispatch = useDispatch();

    function SearchFeature(input) {
        if(input != "") {
            fetch(`https://api.spotify.com/v1/search?q=${input}&type=track`, {
                headers: {
                    'Authorization': 'Bearer ' + props.token
                }
            })
            .then(response => response.json())
            .then(data => {
                setSearchResult(data.tracks.items);
            })
            .catch(err => console.log(err))
        }
        else 
          setSearchResult([]);
    }

    useEffect(() => {
        createPlayListComponent ?
            gsap.to(".create-playlist", {
                duration: 0.5,
                visibility: "visible",
                scale: 1
            })
        :
            gsap.to(".create-playlist", {
                duration: 0.5,
                visibility: "none",
                scale: 0
            })
    }, [createPlayListComponent])

    return (
        <div className="create-playlist z-50 flex justify-center invisible scale-0 items-center absolute inset-0 after:absolute after:content-[''] after:inset-0 after:bg-[#0000007b] after:z-[-1]">
            <div className="create-playlist-card p-4 pb-16 w-[75%] h-[75%] relative flex flex-wrap bg-[#000000c0]">
              <form className="w-full sm:w-[50%] px-1" onSubmit={(e) => {
                e.preventDefault();
                e.target.reset();
              }}>
                <div className="w-full mb-5">
                  <label htmlFor="PlaylistName" className="text-white ml-1">Playlist Name:</label>
                  <input type="text" id="PlaylistName" className="bg-[#ffffff] w-full mt-3 placeholder:text-black font-semibold pr-28 pl-3 py-3" placeholder="PlayList name" />
                </div>
                <div className="playlist-default-tracks text-white">
                  <p>PlayList Wanted Tracks</p>
                  <input type="text" ref={SearchInp} className="bg-transparent my-3 bg-white placeholder:text-black placeholder:text-[12px] md:placeholder:text-[16px] w-full py-2 pl-2 rounded-lg pr-5 border-none outline-none text-black" placeholder="Search for tracks" onInput={() => {
                    SearchFeature(SearchInp.current.value);
                  }}/>
                  <div className="show-tracks w-full sm:h-[15rem] h-[8rem] overflow-auto">
                    {
                        searchResult?.map((song, index) => {
                            return <TrackView key={song.id} addToPlaylist={true} SongId={song.id} showAdd={false} name={song.name} duration={song.duration_ms / 1000} explicitMode={song.explicit} artistName={song.artists} showImage={true} showDuration={true} image={song.album.images[1].url} />
                        })  
                    }
                  </div>
                </div>
              </form>
              <div className="playlist-added-tracks w-full sm:h-full h-[8rem] overflow-auto sm:w-[50%] px-1">
                <p className="text-white">{addedTracks.length != 0 && "Added Tracks"}</p>
                {
                  addedTracks.length == 0 ? 
                  <h1 className="text-white">No Added Tracks</h1>
                  :
                  addedTracks?.map((song,index) => {
                    return <TrackView key={song.SongId} addToPlaylist={song.addToPlaylist} SongId={song.SongId} showAdd={song.showAdd} name={song.name} duration={song.duration} explicitMode={song.explicitMode} artistName={song.artistName} showImage={song.showImage} showDuration={song.showDuration} image={song.image} />
                  })
                }
              </div>
              <button onClick={() => {
                dispatch(hideCreatePlayListComponent());
              }} className="bg-red-700 absolute left-5 bottom-5 text-white px-3 rounded-2xl py-1">Cancel</button>
              <button type="submit" className="bg-green-600 absolute right-5 bottom-5 text-white px-3 rounded-2xl py-1">Submit</button>
            </div>
      </div>
    );
}

export default CreatePlayList