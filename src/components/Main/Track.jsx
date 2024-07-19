import { useEffect, useState } from "react";
import TrackView from "../TrackView";

function Track(props) {

    const [Results, setResults] = useState([{}]);

    function SearchFeature() {
        fetch(`https://api.spotify.com/v1/search?q=tracks&type=track`, {
            headers: {
                'Authorization': 'Bearer ' + props.token
            }
        })
        .then(response => response.json())
        .then(data => {
            // console.log("tracks", data.tracks.items);
            setResults(data);
        })
        .catch(err => console.log(err))
    }

    useEffect(() => {
        SearchFeature();
    }, [props.token])

    return (
        <section>
            <div className="p-4">   
                <div className="flex items-center">
                    <p className="text-white mr-auto text-[27px] font-bold mb-2">Various Tracks</p>
                </div>
                {
                    Results?.tracks?.items.map((song) => {
                        console.log(song);
                        return <TrackView key={song.id} SongId={song.id} showAdd={true} name={song.name} duration={song.duration_ms / 1000} explicitMode={song.explicit} artistName={song.artists} showImage={true} showDuration={true} image={song.album.images[1].url} />
                    })  
                }
            </div>
        </section>
    );
}

export default Track;