import { useEffect, useState } from "react";
import AlbumCard from "../AlbumCard";
import TestImage from "../../assets/Spotify.svg"
import { useSelector } from "react-redux";
import axios from "axios";

function Albums(props) {

    const { FollowedArtists } = useSelector(state => state.Dahboardlayout);
    const [Results, setResults] = useState([]);

    // function SearchFeature() {
    //     fetch(`https://api.spotify.com/v1/search?q=eminem&type=album`, {
    //         headers: {
    //             'Authorization': 'Bearer ' + props.token
    //         }
    //     })
    //     .then(response => response.json())
    //     .then(data => {
    //         setResults(data);
    //     })
    //     .catch(err => console.log(err))
    // }

    async function GetSingleArtistTracks(input, array) {
        const response = await axios.get(`https://api.spotify.com/v1/search?q=${input}&type=album`, {
            headers: {
                'Authorization': 'Bearer ' + props.token
            }
        })
        console.log(response);
        array.push(response.data);
        console.log(array);
        setResults(array);
    }

    async function GetTracks() {
        console.log(FollowedArtists);
        let tempResults = [];
        FollowedArtists.forEach(item => {
            console.log(item);
            GetSingleArtistTracks(item, tempResults);
        })
        console.log(tempResults);
    }

    useEffect(() => {
        GetTracks();
    }, [props.token, FollowedArtists])

    return (
        <section>
            <div className="p-4">
                <div className="flex items-center">
                    <p className="text-white mr-auto text-[27px] font-bold mb-2">All Albums</p>
                </div>
                <div className="grid lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-3 grid-cols-2">
                    {
                        Results.map(item => {
                            return item?.albums?.items?.map(item => {
                                console.log(item);
                                return <AlbumCard key={item?.id} albumID={item?.id} date={item?.release_date} name={item?.name} image={item?.images?.length == 0 ? TestImage : item?.images[0]?.url} artistName={item?.artists[0]?.name} artistID={item?.artists[0]?.id} />
                            })
                        })
                    }
                </div>
            </div>
        </section>
    );
}

export default Albums