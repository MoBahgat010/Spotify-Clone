import axios from "axios";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Swiper, SwiperSlide } from 'swiper/react';
import AlternativeImage from "../../../assets/Spotify.svg"

import 'swiper/css';
import 'swiper/css/pagination';
import PlayListCard from "../../PlayListCard";
import { useDispatch, useSelector } from "react-redux";
import { HideInfoComponent, ShowInfoComponent } from "../../../RTK/Slices/ComponentsSlices";
import ArtistsCards from "../../ArtistCard";

function Home(props) {

    const { prevSeeMoreClickedButton, infoComponent } = useSelector(state => state.Dahboardlayout);
    const dispatch = useDispatch();

    const [MadeForYouPlaylists, setMadeForYouPlaylists] = useState([]);
    const [AllowablewSlides, setAllowablewSlides] = useState(false);
    const [prevSeeMoreButton, setPrevSeeMoreButton] = useState(null);
    const [UserTopArtists, setUserTopArtists] = useState([]);

    const isBigScreen = useMediaQuery({ query: '(min-width: 768px)' })

    async function GetMadeForUser() {
        const UserResponse = await axios.get("https://api.spotify.com/v1/browse/categories/0JQ5DAt0tbjZptfcdMSKl3/playlists",{
          headers: {
              "Authorization": `Bearer ${props.token}`
          },
          name: "Made For You"
        })
        setMadeForYouPlaylists(UserResponse.data.playlists.items);
        console.log(UserResponse);
    }

    async function GetUserTopMixes() {
        const resposne = await axios.get("https://api.spotify.com/v1/search?q=top+mixes&type=playlist",{
            headers: {
                "Authorization": `Bearer ${props.token}`
            }
        })
        console.log(resposne);
    }

    async function GetUserTopArtists() {
        const response = await axios.get("https://api.spotify.com/v1/me/top/artists",{
            headers: {
                "Authorization": `Bearer ${props.token}`
                },
        })
        setUserTopArtists(response.data.items);
    }

    function SeeMore(ele, data) {
        if(ele === prevSeeMoreButton) {
            ele.classList.remove("underline");
            dispatch(HideInfoComponent());
            setPrevSeeMoreButton(null);
        }
        else {
            ele.classList.add("underline");
            prevSeeMoreButton != null && prevSeeMoreButton.classList.remove("underline");
            dispatch(ShowInfoComponent({data, ele}));
            setPrevSeeMoreButton(ele);
        }
    }

    function updateSlides() {
        window.innerWidth >= 768 ? setAllowablewSlides(false) : setAllowablewSlides(true)
    }

    useEffect(() => {
        if(!infoComponent) {
            prevSeeMoreButton?.classList.remove("underline");
            setPrevSeeMoreButton(null);
        }
    }, [prevSeeMoreClickedButton])

    useEffect(() => {
        window.addEventListener('resize', updateSlides);
        return () => window.removeEventListener('resize', updateSlides);
    }, []);

    useEffect(() => {
        GetMadeForUser();
        GetUserTopArtists();
        GetUserTopMixes();
    }, [props.token])

    return (
        <section className="home md:px-5 px-1 py-3">
            <div className="w-full h-full">
                <header className="mb-5 text-center flex items-center justify-center">
                    <img src={props.image == null ? AlternativeImage : props.image} className="md:w-[3rem] md:h-[3rem] w-[1.5rem] h-[1.5rem] mr-5 rounded-full object-cover" alt="profile image" />
                    <h1 className="text-green-600 lg:text-[35px] md:text-[28px] sm:text-[25px] text-[15px] font-extrabold">Hello to Spotify-Clone</h1>
                </header>
                <div className="playlists">
                    <div className="flex">
                        <h1 className="text-white mr-auto text-[27px] font-bold mb-2">PlayLists Made For You</h1>
                        <button className="text-[#ADADAD] hidden md:block hover:underline mr-3" onClick={(e) => {
                            SeeMore(e.target, MadeForYouPlaylists)
                        }}>See more</button>
                    </div>
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
                            AllowablewSlides || !isBigScreen ?
                                MadeForYouPlaylists.map((item) => {
                                    return <SwiperSlide className="px-1" key={item?.id}><PlayListCard key={item?.id} playlistID={item?.id} name={item?.name} image={item?.images[0]?.url} artistName={item?.owner?.display_name} /></SwiperSlide>
                                })      
                            :
                                MadeForYouPlaylists.slice(1,7).map((item) => {
                                    return <SwiperSlide className="px-1" key={item?.id}><PlayListCard key={item?.id} playlistID={item?.id} name={item?.name} image={item?.images[0]?.url} artistName={item?.owner?.display_name} /></SwiperSlide>
                                })      
                        }
                    </Swiper>
                </div>
                <div className="top-artists">
                    <div className="flex">
                        <h1 className="text-white mr-auto text-[27px] font-bold mb-2">You Top Artists</h1>
                        <button className="text-[#ADADAD] hidden md:block hover:underline mr-3" onClick={(e) => {
                            SeeMore(e.target, UserTopArtists)
                        }}>See more</button>
                    </div>
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
                            AllowablewSlides || !isBigScreen ?
                                UserTopArtists.map((item) => {
                                    return <SwiperSlide className="px-1" key={item?.id}><ArtistsCards key={item?.id} artistID={item?.id} name={item?.name} image={item?.images[0]?.url} /></SwiperSlide>
                                })      
                            :
                                UserTopArtists.slice(1,7).map((item) => {
                                    return <SwiperSlide className="px-1" key={item?.id}><ArtistsCards key={item?.id} artistID={item?.id} name={item?.name} image={item?.images[0]?.url} /></SwiperSlide>
                                })      
                        }
                    </Swiper>
                </div>
            </div>
        </section>
    );
}

export default Home;