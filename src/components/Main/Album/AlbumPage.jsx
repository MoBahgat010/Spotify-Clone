import axios from "axios";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import TrackView from "../../TrackView";
import AlbumCard from "../../AlbumCard";
import { Swiper, SwiperSlide } from 'swiper/react';
import "./AlbumPage.css"

import 'swiper/css';
import 'swiper/css/pagination';
import { useDispatch, useSelector } from "react-redux";
import { fetchSongData, setCurrenSongID } from "../../../RTK/Slices/MediaSlice";
import { ShowMediaComponent } from "../../../RTK/Slices/ComponentsSlices";

function AlbumPage(props) {

    const params = useParams();

    const { currentSongID, isSongPlaying } = useSelector(state => state.Media);
    const dispatch = useDispatch();

    const [albumDuration, setALbumDuration] = useState();
    const [noOfSongs, setNoOfSongs] = useState(0);
    const [albumReleaseDate, setAlbumReleaseData] = useState("");
    const [artistName, setArtistName] = useState("");
    const [artistId, setArtistsId] = useState(null);
    const [albumImage, setAlbumImage] = useState(null);
    const [artistImage, setArtistImage] = useState(null);
    const [albumName, setAlbumName] = useState("");
    const [isAddedToLibrary, setIsAddedToLibrary] = useState(false);
    const [albumTracks, setAlbumTracks] = useState([]);
    const [moreAlbums, setMoreAlbums] = useState([]);
    const [songWillBePlayed, setsongWillBePlayed] = useState(null);

    const ToAddAlbum = useRef();
    const AddedAlbum = useRef();

    function TimeIntoMinutes(time) {
        let minutes = Math.floor(time / 60);
        let seconds = time - minutes * 60;
        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        return minutes + " min " + Math.floor(seconds) + " sec";
    }

    function TimeStd(time) {
        let min = Math.floor(time / 60);
        let sec = Math.floor(time % 60);
        if (sec < 10) {
            sec = `0${sec}`
        }
        return `${min}:${sec}`
    } 

    const MyStyle = {
        backgroundImage: `url('${albumImage}')`
    }

    async function GetMoreAlbums() {
        const response = await axios.get(`https://api.spotify.com/v1/search?q=${artistName}&type=album`, {
            headers: {
                'Authorization': 'Bearer ' + props.token
            }
        })
        const temp_arr = response.data.albums.items.filter(album => {
            return album.id != params.albumID
        });
        setMoreAlbums(temp_arr);
    }

    async function ChechIfAlbumAdded() {
        const response = await axios.get(`https://api.spotify.com/v1/me/albums/contains?ids=${params.albumID}`,{
            headers: {
                "Authorization": "Bearer " + props.token
            }
        })
        setIsAddedToLibrary(response.data[0]);
    }

    async function GetAlbumArtistsData() {
        const response = await axios.get(`https://api.spotify.com/v1/artists/${artistId}`, {
            headers: {
                'Authorization': 'Bearer ' + props.token
            }
        });
        setArtistName(response.data.name);
        setArtistImage(response.data.images[2].url);
    }

    function AddAlbumToLibrary() {
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
    
    function RemoveAlbumFromLibrary() {
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
    
    async function GetAlbumData() {
        const response = await axios.get(`https://api.spotify.com/v1/albums/${params.albumID}`, {
            headers: {
                Authorization: `Bearer ${props.token}`
            }
        });
        let AlbumDuration = 0;
        console.log("ALbum Data:", response.data);
        setArtistsId(response.data.artists[0].id);
        GetAlbumArtistsData();
        setAlbumImage(response.data.images[0].url);
        setAlbumName(response.data.name);
        setAlbumReleaseData(response.data.release_date);
        setNoOfSongs(response.data.total_tracks);
        setAlbumTracks(response.data.tracks.items);
        console.log("Album tracks:", albumTracks);
        
        response?.data?.tracks?.items.forEach(item => {
            AlbumDuration += item.duration_ms
        });
        setALbumDuration(AlbumDuration / 1000);
    }
    
    useEffect(() => {
        GetAlbumData();
        ChechIfAlbumAdded();
        GetMoreAlbums();
    },[props.token,params.albumID,artistId,artistName])

    return (
        <section className="album-page w-full h-full">
            <div style={MyStyle} className="relative cover-page z-[1] imge-container w-full h-[18.5rem] after:content-[''] after:absolute after:inset-0 after:bg-[#23232372] after:z-[-1]">
                <div className="inner-content flex gap-2 sm:gap-3 items-center px-2 sm:px-4 md:px-8 absolute bottom-5 left-0 right-0 h-[12rem]">
                    <div className="image-container shadow-2xl">
                        <img src={albumImage} alt="Album Cover" className="lg:w-[12rem] md:w-[9rem] sm:w-[7.5rem] w-[6rem] lg:h-[12rem] md:h-[9rem] sm:h-[7.5rem] h-[6rem] rounded-lg" />
                    </div>
                    <div>
                        <p className="text-[20px] ml-1 sm:ml-2 text-white">Album</p>
                        <h2 className="lg:text-[67px] md:text-[42px] sm:text-[35px] text-[20px] text-white font-[900] line-clamp-1">{albumName}</h2>
                        <div className="artist-data ml-1 sm:ml-2 flex items-center">
                            <img className="sm:w-[1.7rem] w-[1rem] h-[1rem] sm:h-[1.7rem] rounded-full my-1 sm:my-0" src={artistImage} alt="artists image" />
                            <Link to={`/dashboard/artist/${artistId}`} className="text-white ml-3 mr-1 md:text-[13px] text-[9px] sm:text-[12px] font-bold hover:underline">{artistName}</Link>
                            <p className="text-white text-[9px] sm:text-[12px] md:text-[16px]">. {albumReleaseDate.split("-").slice(0,1)} .</p>
                            <p className="text-white text-[9px] sm:text-[12px] md:text-[16px]"> {noOfSongs} {noOfSongs > 1 ? "Songs" : "Song"} . {TimeIntoMinutes(albumDuration)}</p>
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
                <div className="album-tracks w-full md:mt-2 mt-0">
                    <table className="w-full">
                        <thead className="text-white h-[3rem] border-b-2 border-[#393939]">
                            <th className=" w-[3rem] text-center">#</th>
                            <th className="text-start">Title</th>
                            <th className="w-[4rem]"><i class="fa-regular fa-clock"></i></th>
                        </thead>
                        <tbody>
                            {
                                albumTracks?.map((song, index) => {
                                    return (
                                        <tr className="hover:bg-[#1b1b1b] cursor-pointer group" key={song.id} onClick={(e) => {
                                            dispatch(setCurrenSongID(song.id));
                                            setsongWillBePlayed(song.id);
                                            dispatch(ShowMediaComponent());
                                            dispatch(fetchSongData());
                                        }}>
                                            <td className="text-[#ADADAD] text-center relative">
                                                <p id="index" className="group-hover:hidden" >{isSongPlaying && currentSongID == song.id ? "" : index + 1}</p>
                                                {
                                                    isSongPlaying && currentSongID == song.id ?
                                                        <i className="fa-solid fa-pause absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-white"></i>
                                                    :
                                                        <i className="fa-solid fa-play hidden group-hover:inline-block absolute top-[50%] left-[53%] translate-x-[-50%] translate-y-[-50%] text-white"></i>
                                                }
                                            </td>
                                            <td>
                                                <TrackView key={song.id} showAdd={true} SongId={song.id} name={song.name} duration={song.duration_ms / 1000} explicitMode={song.explicit} artistName={song.artists} showDuration={false} showImage={false} image={song.image}/>
                                            </td>
                                            <td className="text-[#ADADAD] text-center">{TimeStd(song.duration_ms / 1000)}</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
                {
                    moreAlbums?.length > 0 &&
                    <div className="moreAlbums mt-5">
                        <p className="text-white text-[27px] font-bold mb-2">Albums</p>
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
                                moreAlbums?.slice(0,6).map((item) => {
                                    return <SwiperSlide className="px-1" key={item?.id}><AlbumCard key={item?.id} albumID={item?.id} date={item?.release_date} name={item?.name} image={item?.images[0]?.url} artistName={item?.artists[0]?.name} artistID={item?.artists[0]?.id} /></SwiperSlide>
                                })  
                            }
                                </Swiper>
                    </div>
                }
            </div>
        </section>
    );
}

export default AlbumPage;