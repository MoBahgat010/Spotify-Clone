import axios from "axios";
import { useEffect, useState } from "react";
import TrackView from "../TrackView/TrackView";

function LikedSongsPage(props) {

    const [likedSongs, setLikedSongs] = useState([]);

    async function GetLikedSongs() {
        const response = await axios.get('https://api.spotify.com/v1/me/tracks', {
            headers: {
                'Authorization': 'Bearer ' + props.token
            }
        })  
        setLikedSongs(response.data.items);
    }

    useEffect(() => {
        GetLikedSongs();
    }, [])

    return (
        <section className="likedSongs overflow-auto">
            {
                likedSongs?.map(song => {
                    console.log(song.track);
                    return <TrackView key={song.track.id} addToPlaylist={false} SongId={song.track.id} showAdd={true} name={song.track.name} duration={song.track.duration_ms / 1000} explicitMode={song.track.explicit} artistName={song.track.artists} showImage={true} showDuration={true} image={song.track?.album?.images[1]?.url} />
                })
            }
        </section>
    )
}

export default LikedSongsPage;