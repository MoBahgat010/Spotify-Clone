import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import TrackView from "../../TrackView"
import ArtistsCards from "../../ArtistCard"
import AlbumCard from "../../AlbumCard"
import "./ArtistPage.css"
import { Swiper, SwiperSlide } from 'swiper/react';
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';

import 'swiper/css';
import 'swiper/css/pagination';
import { data } from "autoprefixer";

function ArtistPage(props) {

    const params = useParams();
    const [isFollowed, setIsFollowed] = useState(false);
    const [artistName, setArtistsName] = useState("");
    const [artistImage, setArtistImage] = useState(null);
    const [artistFollowers, setArtistFollowers] = useState(0);
    const [tracks, setTracks] = useState([]);
    const [showedTracks, setShowedTracks] = useState(5);
    const [relatedArtists, setRelatedArtists] = useState([]);
    const [artistsAlbums, setArtistsAlbums] = useState([]);

    const MyStyle = {
        backgroundImage: `url('${artistImage}')`
    }
    
    
    function NumberStd(passed_number) {
        return passed_number.toLocaleString();
    }
    
    async function UnFollowArtist() {
        const response = await axios.delete('https://api.spotify.com/v1/me/following', {
            params: {
                'type': 'artist',
                'ids': `${params.artistID}`
            },
            headers: {
                'Authorization': "Bearer " + props.token,
                'Content-Type': 'application/json'
            },
            // data: '{\n    "ids": [\n        "string"\n    ]\n}',
            data: {
                'ids': [
                    'string'
                ]
            }
        });
        console.log(response);
        setIsFollowed(false);
    }
    
    async function FollowArtist() {
        const response = await axios.put(
            'https://api.spotify.com/v1/me/following',
            {
                'ids': [
                    'string'
                ]
            },
            {
                params: {
                    'type': 'artist',
                    'ids': `${params.artistID}`
                },
                headers: {
                    'Authorization': "Bearer " + props.token,
                    'Content-Type': 'application/json'
                }
            }
        );
        // console.log(response);
        setIsFollowed(true);
    }
    
    async function CheckIfFollowed() {
        const response = await axios.get(`https://api.spotify.com/v1/me/following/contains?type=artist&ids=${params.artistID}`,{
            headers: {
                'Authorization': `Bearer ${props.token}`
            }
        });
        setIsFollowed(response.data[0]);
    }

    async function GetArtistsAlbums() {
        const response = await axios.get(`https://api.spotify.com/v1/artists/${params.artistID}/albums`,
            { headers: { Authorization: `Bearer ${props.token}` } });
        setArtistsAlbums(response.data.items);    
    }

    async function GetRelatedArtists() {
        const response = await axios.get(`https://api.spotify.com/v1/artists/${params.artistID}/related-artists`, {
            headers: {
                'Authorization': 'Bearer ' + props.token
            }
        });
        setRelatedArtists(response.data.artists);
    }
    
    async function GetArtistData() {
        const response = await axios.get(`https://api.spotify.com/v1/artists/${params.artistID}`, {
            headers: {
                Authorization: `Bearer ${props.token}`
            }
        })
        setArtistFollowers(response.data.followers.total);
        setArtistImage(response.data.images[0].url);
        setArtistsName(response.data.name);
    }

    async function GetArtistPopularTracks() {
        let response = await axios(`https://api.spotify.com/v1/artists/${params.artistID}/top-tracks`,
            { 
                headers: { Authorization: "Bearer " + props.token } 
            });
            setTracks(response.data.tracks);
        }
        
    useEffect(() =>{
        GetArtistData();
        GetArtistPopularTracks();
        GetRelatedArtists();
        GetArtistsAlbums();
        CheckIfFollowed();
    },[props.token, params.artistID])
    
    return (
        <section className="artist-page w-full h-full">
            <div style={MyStyle} className="relative cover-page z-[1] imge-container w-full h-[18.5rem] after:content-[''] after:absolute after:inset-0 after:bg-gradient-to-b after:from-transparent after:to-[#818181] after:z-[-1]">
                <div className="inner-content px-5 absolute bottom-0 left-0 right-0 h-[12rem]">
                    <h2 className="lg:text-[90px] md:text-[70px] sm:text-[50px] text-[30px] text-white font-[900]">{artistName}</h2>
                    <p className="text-white font[800] pl-2">{NumberStd(artistFollowers)} Followers</p>
                </div>
            </div>
            <div className="artist-data px-5 py-3 bg-gradient-to-b from-[#202020] to-transparent">
                <div className="options flex items-center">
                    <button className="relative w-[5rem] h-[5rem] rounded-full hover:scale-105 duration-300 bg-green-600">
                        <i className="fa-solid fa-play scale-150 absolute top-[50%] left-[50%] translate-x-[-35%] translate-y-[-50%] text-white"></i> 
                    </button>
                    <button className="rounded-3xl ml-10 hover:scale-105 duration-300 border py-2 px-5 border-3 bg-transparent border-[#ADADAD] hover:border-white text-white" onClick={() => {
                        isFollowed ? UnFollowArtist() : FollowArtist()
                        notify
                    }}>{isFollowed ? "Followed" : "Follow"}</button>
                </div>
                <div className="popular-tracks my-5 w-full mt-7">
                    <p className="text-white text-[30px] font-bold mb-5">Popular Tracks</p>
                    {
                        tracks?.slice(0, showedTracks < tracks.length ? showedTracks : tracks.length).map((track, index) => {
                            return <TrackView key={track.id} showAdd={true} showDuration={true} SongId={track.id} name={track.name} duration={track.duration_ms / 1000} explicitMode={track.explicit} artistName={track.artists} showImage={true} image={track.album.images[1].url} />
                        })  
                    }
                    {
                        showedTracks < tracks.length && 
                        <button className="text-[#ADADAD] inline font-bold ml-2 mt-1 w-fit hover:underline cursor-pointer" onClick={() => {
                            setShowedTracks(showedTracks + 5);
                        }}>Show more</button>   
                    }
                    {
                        showedTracks > 5 && 
                        <button className="text-[#ADADAD] inline font-bold ml-2 mt-1 w-fit hover:underline cursor-pointer" onClick={() => {
                            setShowedTracks(showedTracks - 5);
                        }}>Show less</button>   
                    }
                </div>
                <div className="related-artists">
                    <p className="text-white text-[30px] font-bold mb-5">Related Artists</p>
                    <Swiper
                        slidesPerView={6}
                        className="mySwiper"
                        breakpoints={{
                            // when window width is >= 300px
                            300: {
                                slidesPerView: 2,
                            },
                            460: {
                                slidesPerView: 3,
                            },
                            // when window width is >= 768px
                            768: {
                              slidesPerView: 5,
                            },
                            // when window width is >= 1024px
                            1024: {
                              slidesPerView: 6,
                            },
                          }}
                        >
                        {
                            relatedArtists?.slice(0,6)?.map((item) => {
                                return <SwiperSlide className="px-1" key={item?.id}><ArtistsCards key={item?.id} artistID={item?.id} name={item?.name} image={item?.images[0]?.url} /></SwiperSlide>
                            })
                        }
                    </Swiper>
                </div>
                <div className="artist-albums my-5">
                    <p className="text-white text-[30px] font-bold mb-5">{artistName}'s Albums</p>
                    <Swiper
                            slidesPerView={6}
                            className="mySwiper"
                            breakpoints={{
                                // when window width is >= 300px
                                300: {
                                    slidesPerView: 2,
                                },
                                460: {
                                    slidesPerView: 3,
                                },
                                // when window width is >= 768px
                                768: {
                                  slidesPerView: 5,
                                },
                                // when window width is >= 1024px
                                1024: {
                                  slidesPerView: 6,
                                },
                              }}
                            >
                            {
                                artistsAlbums?.slice(0,6).map((item) => {
                                    return <SwiperSlide className="px-1" key={item?.id}><AlbumCard key={item?.id} albumID={item?.id} date={item?.release_date} name={item?.name} image={item?.images[0]?.url} artistName={item?.artists[0]?.name} /></SwiperSlide>
                                })  
                            }
                            </Swiper>
                </div>
            </div>
        </section>
    );
}

export default ArtistPage;