import { useEffect, useState } from "react";
import TrackView from "../TrackView/TrackView";
import { useSelector } from "react-redux";
import axios from "axios";

function Track(props) {

    const { FollowedArtists } = useSelector(state => state.Dahboardlayout);
    const [Results, setResults] = useState([{}]);

    // function SearchFeature() {
    //     fetch(`https://api.spotify.com/v1/search?q=tracks&type=track`, {
    //         headers: {
    //             'Authorization': 'Bearer ' + props.token
    //         }
    //     })
    //     .then(response => response.json())
    //     .then(data => {
    //         console.log("tracks", data.tracks.items);
    //         setResults(data);
    //     })
    //     .catch(err => console.log(err))
    // }

    async function GetSingleArtistTracks(input, array) {
        const response = await axios.get(`https://api.spotify.com/v1/search?q=${input}&type=track`, {
            headers: {
                'Authorization': 'Bearer ' + props.token
            }
        })
        array.push(response.data);
        setResults(array);
    }

    async function GetTracks() {
        console.log(FollowedArtists);
        let tempResults = [];
        FollowedArtists.forEach(item => {
            console.log(item);
            GetSingleArtistTracks(item, tempResults);
        })
    }

    useEffect(() => {
        // SearchFeature();
        GetTracks();
    }, [props.token, FollowedArtists])

    return (
        <section>
            <div className="p-4">   
                <div className="flex items-center">
                    <p className="text-white mr-auto text-[27px] font-bold mb-2">Various Tracks</p>
                </div>
                {
                    Results?.map(item => {
                        console.log(item);
                        return item?.tracks?.items.map(song => {
                            return <TrackView key={song.id} addToPlaylist={false} SongId={song.id} showAdd={true} name={song.name} duration={song.duration_ms / 1000} explicitMode={song.explicit} artistName={song.artists} showImage={true} showDuration={true} image={song.album.images[1].url} />
                        })  
                    })
                }
            </div>
        </section>
    );
}

export default Track;