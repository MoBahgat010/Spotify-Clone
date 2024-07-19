import { Link, useParams } from "react-router-dom";
import TestImage from "../../../assets/Eminem.jpg"
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import TrackView from "../../TrackView";
import ALternativeImage from "../../../assets/Spotify.svg"
import { fetchSongData, setCurrenSongID, setSongListToPlay } from "../../../RTK/Slices/MediaSlice";
import { ShowMediaComponent } from "../../../RTK/Slices/ComponentsSlices";
import { useDispatch, useSelector } from "react-redux";
import gsap from "gsap";

function PlayListPage(props) {

    const { currentSongID, isSongPlaying, SongListToPlay } = useSelector(state => state.Media);
    const dispatch = useDispatch();

    const params = useParams();
    const [PlayListData, setPlayListData] = useState();
    const [playListTime, setPlayListTime] = useState(0);
    const [playListTracks, setPlayListTracks] = useState([]);
    const [isAddedToLibrary, setIsAddedToLibrary] = useState(false);

    const ToAddAlbum = useRef();
    const AddedAlbum = useRef();

    const MyStyle = {
        backgroundImage: `url('${PlayListData?.images[0]?.url}')`
    }

    async function AddAlbumToLibrary(id) {
        const response = await axios.put(
            `https://api.spotify.com/v1/playlists/${params.playlistID}/followers`,
            // '{\n    "public": false\n}',
            {
              'public': false
            },
            {
              headers: {
                'Authorization': 'Bearer ' + props.token,
                'Content-Type': 'application/json'
              }
            }
        );
        console.log("I'm adding");
        const tl = gsap.timeline();
        tl.to(".album-data .options .add-to-library .to-add",{
            scale: 0,
            duration: 0.5
        })
        tl.to(".album-data .options .add-to-library .added",{
            scale: 1,
            duration: 0.5,
        },'<')
        setIsAddedToLibrary(true);
    }
    
    async function RemoveAlbumFromLibrary() {
        const response = await axios.delete(`https://api.spotify.com/v1/playlists/${params.playlistID}/followers`, {
            headers: {
              'Authorization': 'Bearer ' + props.token
            }
          });
        console.log("I'm removing");
        const tl = gsap.timeline();
        tl.to(".album-data .options .add-to-library .added",{
            scale: 0,
            duration: 0.5,
        })
        tl.to(".album-data .options .add-to-library .to-add",{
            scale: 1,
            duration: 0.5
        })
        setIsAddedToLibrary(false);
    }

    function TimeSTD(time) {
        let hours = Math.floor(time / 3600);
        let minutes = Math.floor(time / 60) - (hours * 60);
        let seconds = time - hours * 3600 - minutes * 60;
        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        return hours + " hr " + minutes + " min " + Math.floor(seconds) + " sec";
    }

    function TimeStd(time) {
        let min = Math.floor(time / 60);
        let sec = Math.floor(time % 60);
        if (sec < 10) {
            sec = `0${sec}`
        }
        return `${min}:${sec}`
    } 

    function NumberStd(passed_number) {
        return passed_number?.toLocaleString();
    }

    async function CheckIfUserFollowsPlaylist() {
        const response = await axios.get(`https://api.spotify.com/v1/playlists/${params.playlistID}/followers/contains`, {
            headers: {
              'Authorization': 'Bearer ' + props.token
            }
        });
        console.log("jkl", response.data[0]);
        setIsAddedToLibrary(response.data[0]);
        const tl = gsap.timeline();
        if(response.data[0]) {
            tl.set(".album-data .options .add-to-library .to-add",{
                scale: 0,
                duration: 0.5
            })
            tl.set(".album-data .options .add-to-library .added",{
                scale: 1,
                duration: 0.5,
            },'<')
        }
        else {
            tl.set(".album-data .options .add-to-library .added",{
                scale: 0,
                duration: 0.5,
            })
            tl.set(".album-data .options .add-to-library .to-add",{
                scale: 1,
                duration: 0.5
            })
        }
    }

    async function GetPlayListData() {
        console.log("Helllllllllllooooooooooooooo");
        const response =  await axios.get(`https://api.spotify.com/v1/playlists/${params.playlistID}`,{
            headers: {
                "Authorization": "Bearer " + props.token
            }
        });
        console.log("PlayList", response);
        const ValidTracks = response?.data?.tracks?.items.filter(item => {
            return item.track != null;
        }) 
        let duration = 0;
        ValidTracks.forEach(item => {
            // if(item.track != null)
                return duration += item.track.duration_ms;
        })
        setPlayListTracks(ValidTracks);

        // console.log("ooohyaaa", ValidTracks);
        // dispatch(setSongListToPlay(ValidTracks));   

        setPlayListData(response.data);
        setPlayListTime(duration / 1000);
        CheckIfUserFollowsPlaylist()
    }

    console.log("jkl", isAddedToLibrary);

    useEffect(() => {
        GetPlayListData();
    },[props.token, params.playlistID])

    return (
        <section className="playlist-page w-full h-full">
            <div style={MyStyle} className="relative cover-page z-[1] imge-container w-full h-[18.5rem] after:content-[''] after:absolute after:inset-0 after:bg-[#23232372] after:z-[-1]">
                <div className="inner-content flex gap-2 sm:gap-3 items-center px-2 sm:px-4 md:px-8 absolute bottom-7 left-0 right-0 h-[12rem]">
                    <div className="image-container shadow-2xl lg:w-[12rem] md:w-[9rem] sm:w-[7.5rem] w-[6rem] lg:h-[14rem] md:h-[10rem] sm:h-[9rem] h-[7rem]">
                        <img src={PlayListData?.images.length ? PlayListData?.images[0]?.url : ALternativeImage} alt="Album Cover" className="w-full h-full rounded-lg" />
                    </div>
                    <div className="w-full">
                        <p className="text-[20px] ml-0   sm:ml-2 text-white">Playlist</p>
                        <h2 className="lg:text-[67px] md:text-[42px] sm:text-[35px] text-[20px] text-white font-[900] line-clamp-1">{PlayListData?.name}</h2>
                        <p className="text-[#ADADAD] ml-0 sm:ml-1 md:ml-2 mb-2 mr-1 md:text-[13px] text-[9px] sm:text-[12px] lg:line-clamp-2 line-clamp-1">{PlayListData?.description}</p>
                        <div className="artist-data ml-1 sm:ml-2 flex items-center">
                            <img className="sm:w-[1.7rem] w-[1rem] h-[1rem] sm:h-[1.7rem] rounded-full my-1 sm:my-0" src={PlayListData?.images[0]?.url} alt="artists image" />
                            <Link className="text-white ml-3 mr-1 md:text-[13px] text-[9px] sm:text-[12px] font-bold hover:underline line-clamp-1">{PlayListData?.owner?.display_name}</Link>
                            <p className="text-white text-[9px] sm:text-[12px] md:text-[16px] line-clamp-1">. {NumberStd(PlayListData?.followers?.total)} saves . {PlayListData?.tracks?.total} songs,</p>
                            <p className="text-white text-[9px] sm:text-[12px] md:text-[16px] line-clamp-1">{TimeSTD(playListTime)}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="album-data px-2 sm:px-4 md:px-8 py-3 bg-gradient-to-b from-[#202020] to-transparent">
                <div className="options flex items-center">
                    <button className="relative lg:w-[5rem] md:w-[4rem] w-[3rem] lg:h-[5rem] md:h-[4rem] h-[3rem] rounded-full hover:scale-105 duration-300 bg-green-600">
                        <i className="fa-solid fa-play lg:scale-150 md:scale-125 sm:scale-100 scale-90 absolute top-[50%] left-[50%] translate-x-[-35%] translate-y-[-50%] text-white"></i> 
                    </button>
                    <button className="add-to-library ml-10  md:w-[2rem] w-[1.5rem] md:h-[2rem] h-[1.5rem] relative hover:scale-105 duration-300 group" onClick={() => { isAddedToLibrary ? RemoveAlbumFromLibrary() : AddAlbumToLibrary() }}>
                        <div ref={ToAddAlbum} className="to-add  rounded-full absolute inset-0 border-2 bg-transparent border-[#ADADAD] group-hover:border-white text-[#ADADAD]">
                            <i class="fa-solid fa-plus text-[#ADADAD] p-0 m-0 group-hover:text-[#fff] absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]"></i>
                        </div>
                        <div ref={AddedAlbum} className="added scale-0 rounded-full absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] p-4 inset-0 hover:scale-105 duration-300 bg-green-700">
                            <i class="fa-solid text-black fa-check p-0 m-0 absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]"></i>
                        </div>
                    </button>
                </div>
                <div className="playlist-tracks w-full md:mt-2 mt-0">
                    <table className="w-full">
                        <thead className="text-white h-[3rem] border-b-2 border-[#393939]">
                            <th className="w-[1rem] sm:w-[2rem] md:w-[3rem] text-center text-[10px] sm:text-[12px] md:text-[16px]">#</th>
                            <th className="text-start w-[10%] sm:w-[35%] md:w-[45%] text-[12px] md:text-[16px]">Title</th>
                            <th className="text-start w-[10%] sm:w-[20%] md:w-[30%] text-[10px] sm:text-[12px] md:text-[16px]">Album</th>
                            <th className="text-start w-[15%] md:w-fit text-[10px] sm:text-[12px] md:text-[16px]"><p className="line-clamp-1">Date added</p></th>
                            <th className="invisible w-[2rem] hidden sm:block"></th>
                            <th className="w-[2rem] sm:w-[3rem] md:w-[4rem]"><i class="fa-regular fa-clock text-[10px] md:text-[16px]"></i></th>
                        </thead>
                        <tbody>
                            {
                                playListTracks?.map((item, index) => {
                                    return (
                                        <tr className="hover:bg-[#1b1b1b] cursor-pointer group" key={item.track.id} onClick={() => {
                                            console.log(item.track.id);
                                            dispatch(setCurrenSongID(item.track.id));
                                            dispatch(ShowMediaComponent());
                                            dispatch(fetchSongData());
                                        }}>
                                            <td key={item.track.id} className="text-[#ADADAD] relative text-center">
                                                <p className="group-hover:hidden">{isSongPlaying && currentSongID == item.track.id ? "" : index + 1}</p>
                                                {
                                                    isSongPlaying && currentSongID == item.track.id ?
                                                        <i className="fa-solid fa-pause absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-white"></i>
                                                    :
                                                        <i className="fa-solid fa-play hidden group-hover:inline-block absolute top-[50%] left-[53%] translate-x-[-50%] translate-y-[-50%] text-white"></i>
                                                }
                                            </td>
                                            <td key={item.track.id} className="w-[5rem] sm:w-[35%] md:w-[45%]">
                                                <TrackView key={item.track?.id} showAdd={false} SongId={item.track?.id} name={item.track?.name} duration={item.track?.duration_ms / 1000} explicitMode={item.track?.explicit} artistName={item.track?.artists} showDuration={false} showImage={false} image={item.track?.image}/>
                                            </td>
                                            <td className="text-[#ADADAD] pr-5 "><Link to={`/dashboard/album/${item.track?.album?.id}`} className="hover:underline line-clamp-1 text-[10px] sm:text-[12px] md:text-[14px]">{item.track.album.name}</Link></td>
                                            <td className="text-[#ADADAD]"><p className="line-clamp-1 text-[10px] sm:text-[12px] md:text-[16px]">{item.track.album.release_date}</p></td>
                                            <td className="text-center hidden sm:table-cell">
                                                <span className="relative hover:cursor-pointer text-white scale-90 sm:scale-95 md:scale-100  after:absolute after:content-[''] after:top-[50%] after:left-[50%] after:w-[20px] after:h-[20px] after:translate-x-[-50%] after:translate-y-[-40%] after:invisible invisible group-hover:visible group-hover:after:visible after:bg-transparent after:border-2 after:border-[#ADADAD] after:rounded-full">+</span>
                                            </td>
                                            <td key={item.track.id} className="text-[#ADADAD] text-[10px] sm:text-[12px] md:text-[16px] text-center">
                                                {TimeStd(item.track.duration_ms / 1000)}
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}

export default PlayListPage;