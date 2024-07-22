import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HideInfoComponent, ShowInfoComponent } from "../../../RTK/Slices/ComponentsSlices";
import './Search.css'
import { Link } from "react-router-dom";
import TopResults from "../../TopResults";
import TrackView from "../../TrackView/TrackView";
import ArtistsCards from "../../ArtistCard";
import axios from "axios";
import PlayListCard from "../../PlayListCard";
import AlbumCard from "../../AlbumCard";
import EpisodeCard from "../../PodCastCard";
import PodCastCard from "../../PodCastCard";
import AlternativeImage from "../../../assets/Spotify.svg"

import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/pagination';
import { useMediaQuery } from "react-responsive";



function Search(props) {
    // console.log("Access Token in Search Page:", props.token);

    const { prevSeeMoreClickedButton, infoComponent } = useSelector(state => state.Dahboardlayout);
    console.log(prevSeeMoreClickedButton);
    const dispatch = useDispatch();

    const [searchResult, setSearchResult] = useState([{}]);
    const [AllowablewSlides, setAllowablewSlides] = useState(false);
    const [prevSeeMoreButton, setPrevSeeMoreButton] = useState(null);
    const SearchInp = useRef();
    const ViewSearchResults = useRef();

    const isBigScreen = useMediaQuery({ query: '(min-width: 768px)' })

    const SeeMoreButton = useRef();

    function SearchFeature(input) {
        if(input != "") {
            fetch(`https://api.spotify.com/v1/search?q=${input}&type=album%2Cartist%2Cplaylist%2Ctrack%2Cepisode%2Cshow`, {
                headers: {
                    'Authorization': 'Bearer ' + props.token
                }
            })
            .then(response => response.json())
            .then(data => {
                // console.log("tracks", data.tracks.items);
                setSearchResult(data);
            })
            .catch(err => console.log(err))
        }
        else 
            setSearchResult("");
    }

    useEffect(() => {
        if(SearchInp.current.value == "") 
            ViewSearchResults.current.classList.add('hidden');
        else 
            ViewSearchResults.current.classList.remove('hidden');
    })

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

    return (
        <div className="search-page w-full h-full md:px-5 px-1 py-3">
                <header className="flex items-center">
                    <img src={props.image == null ? AlternativeImage : props.image} className="md:w-[3rem] md:h-[3rem] w-[1.5rem] h-[1.5rem] mr-5 rounded-full object-cover" alt="profile image" />
                    <div className="input-bar rounded-3xl flex items-center md:w-[20rem] w-[12rem] md:h-[2.5rem] h-[2rem] bg-[#2A2A2A]">
                        <i className="fa-solid fa-magnifying-glass text-white p-3 border-r-1 border-white"></i>
                        <input type="text" ref={SearchInp} className="bg-transparent placeholder:text-[12px] md:placeholder:text-[16px] w-full pr-5 border-none outline-none text-white" placeholder="What do you want to play" onInput={() => {
                            SearchFeature(SearchInp.current.value)
                        }} />
                    </div>
                </header>
                {/* <div className="flex items-center justify-center w-full my-5">
                    <div className="px-2">
                        <button className="text-white bg-[#2A2A2A] duration-200 rounded-3xl md:px-4 px-3 py-1 hover:bg-[#3f3f3f] text-[12px] md:text-[16px] active">All</button>
                    </div>
                    <div className="px-2">
                        <button className="text-white bg-[#2A2A2A] duration-200 rounded-3xl md:px-4 px-3 py-1 hover:bg-[#3f3f3f] text-[12px] md:text-[16px]">Songs</button>
                    </div>
                </div> */}
                <div ref={ViewSearchResults} className="top-search-results flex flex-wrap my-5">
                    <div className="lg:w-[35%] w-[100%] flex flex-col h-full">
                        <p className="text-white text-[24px] lg:text-[27px] font-bold mb-2 overflow-hidden text-ellipsis whitespace-nowrap">Top PlayList Results</p>
                        {/* {
                            console.log("klklklklkl", searchResult?.playlists)
                        } */}
                        <TopResults name={searchResult?.playlists?.items[0]?.name} playlistID={searchResult?.playlists?.items[0].id} artistName={searchResult?.playlists?.items[0]?.owner?.display_name} image={searchResult?.playlists?.items[0]?.images[0]?.url}/>
                    </div>
                    <div className="top-songs lg:w-[65%] w-[100%] px-3 md:mt-4 lg:mt-0">
                        <div className="flex">
                            <p className="text-white text-[27px] font-bold mb-2 mr-auto">{searchResult?.tracks?.items?.length > 0 && "Songs"}</p>
                            <button className="text-[#ADADAD] hidden md:block hover:underline mr-3" onClick={(e) => {
                                SeeMore(e.target, searchResult?.tracks?.items)
                            }}>See more</button>
                        </div>
                        <div className="inner-container">   
                            {
                                searchResult?.tracks?.items.slice(0,4).map((song, index) => {
                                    console.log(song);
                                    return <TrackView key={song.id} addToPlaylist={false} SongId={song.id} showAdd={true} name={song.name} duration={song.duration_ms / 1000} explicitMode={song.explicit} artistName={song.artists} showImage={true} showDuration={true} image={song.album.images[1].url} />
                                })  
                            }
                        </div>
                    </div>
                </div>
                {
                    searchResult?.artists?.items?.length > 0 &&
                        <div className="artists my-5 px-2">
                            <div className="flex">
                                <p className="text-white mr-auto text-[27px] font-bold mb-2">Artists</p>
                                <button ref={SeeMoreButton} className="text-[#ADADAD] hidden md:block hover:underline mr-3" onClick={(e) => {
                                    SeeMore(e.target, searchResult?.artists?.items)
                                }}>See more</button>
                            </div>
                            <div className="w-full cursor-grab md:cursor-default">
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
                                        searchResult?.artists?.items.map((item) => {
                                            return <SwiperSlide className="px-1" key={item?.id}><ArtistsCards key={item?.id} artistID={item?.id} name={item?.name} image={item?.images[0]?.url} /></SwiperSlide>
                                        })
                                    :
                                        searchResult?.artists?.items.slice(0,6).map((item) => {
                                            return <SwiperSlide className="px-1" key={item?.id}><ArtistsCards key={item?.id} artistID={item?.id} name={item?.name} image={item?.images[0]?.url} /></SwiperSlide>
                                        })
                                }
                                </Swiper>
                            </div>
                        </div>
                }
                {
                    searchResult?.playlists?.items?.length > 0 &&

                    <div className="albums my-5 px-2">
                        <div className="flex">
                            <p className="text-white mr-auto text-[27px] font-bold mb-2">Albums</p>
                            <button className="text-[#ADADAD] hidden md:block hover:underline mr-3" onClick={(e) => {
                                SeeMore(e.target, searchResult?.albums?.items)
                            }}>See more</button>
                        </div>
                        <div className="flex">
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
                                    searchResult?.albums?.items.map((item) => {
                                        return <SwiperSlide className="px-1" key={item?.id}><AlbumCard key={item?.id} albumID={item?.id} date={item?.release_date} name={item?.name} image={item?.images[0]?.url} artistName={item?.artists[0]?.name} artistID={item?.artists[0]?.id} /></SwiperSlide>
                                    })  
                                :
                                    searchResult?.albums?.items.slice(0,6).map((item) => {
                                        return <SwiperSlide className="px-1" key={item?.id}><AlbumCard key={item?.id} albumID={item?.id} date={item?.release_date} name={item?.name} image={item?.images[0]?.url} artistName={item?.artists[0]?.name} artistID={item?.artists[0]?.id} /></SwiperSlide>
                                    })  
                            }
                            </Swiper>
                        </div>
                    </div>
                }
                {
                    searchResult?.playlists?.items?.length > 0 &&

                    <div className="playlists my-5 px-2">
                        <div className="flex">
                            <p className="text-white mr-auto text-[27px] font-bold mb-2">PlayLists</p>
                            <button className="text-[#ADADAD] hidden md:block hover:underline mr-3" onClick={(e) => {
                                SeeMore(e.target, searchResult?.playlists?.items)
                            }}>See more</button>
                        </div>
                        <div className="flex">
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
                                    searchResult?.playlists?.items.map((item) => {
                                        return <SwiperSlide className="px-1" key={item?.id}><PlayListCard key={item?.id} playlistID={item?.id} name={item?.name} image={item?.images[0]?.url} artistName={item?.owner?.display_name} /></SwiperSlide>
                                    })      
                                :
                                    searchResult?.playlists?.items.slice(1,7).map((item) => {
                                        return <SwiperSlide className="px-1" key={item?.id}><PlayListCard key={item?.id} playlistID={item?.id} name={item?.name} image={item?.images[0]?.url} artistName={item?.owner?.display_name} /></SwiperSlide>
                                    })      
                            }
                            </Swiper>
                        </div>
                    </div>
                }
                {
                    searchResult?.episodes?.items?.length  > 0 && 

                    <div className="episodes my-5 px-2">
                        <div className="flex">
                            <p className="text-white mr-auto text-[27px] font-bold mb-2">Episodes</p>
                            <button className="text-[#ADADAD] hidden md:block hover:underline mr-3" onClick={(e) => {
                                SeeMore(e.target, searchResult?.episodes?.items)
                            }}>See more</button>
                        </div>
                        <div className="flex">
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
                                // when window width is >= 640px
                                640: {
                                  slidesPerView: 4,
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
                                    searchResult?.episodes?.items.map((item) => {
                                        return <SwiperSlide className="px-1" key={item?.id}><EpisodeCard key={item?.id} name={item?.name} image={item?.images[0]?.url} artistName={item?.owner?.display_name} /></SwiperSlide>
                                    })   
                                :
                                    searchResult?.episodes?.items.slice(1,7).map((item) => {
                                        return <SwiperSlide className="px-1" key={item?.id}><EpisodeCard key={item?.id} name={item?.name} image={item?.images[0]?.url} artistName={item?.owner?.display_name} /></SwiperSlide>
                                    })   
                            }
                            </Swiper>
                        </div>
                    </div>
                }
                {
                    searchResult?.tracks?.items?.length > 0 &&

                    <div className="episodes my-5 px-2">
                        <div className="flex">
                            <p className="text-white mr-auto text-[27px] font-bold mb-2">PodCasts</p>
                            <button className="text-[#ADADAD] hidden md:block hover:underline mr-3" onClick={(e) => {
                                SeeMore(e.target, searchResult?.shows?.items)
                            }}>See more</button>
                        </div>
                        <div>
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
                                // when window width is >= 640px
                                640: {
                                  slidesPerView: 4,
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
                                    searchResult?.shows?.items.map((item, index) => {
                                        return <SwiperSlide className="px-1" key={item?.id}><PodCastCard key={item?.id} publisher={item.publisher} name={item?.name} image={item?.images[0]?.url} artistName={item?.owner?.display_name} /></SwiperSlide>
                                    })   
                                :
                                    searchResult?.shows?.items.slice(0,6).map((item, index) => {
                                        return <SwiperSlide className="px-1" key={item?.id}><PodCastCard key={item?.id} publisher={item.publisher} name={item?.name} image={item?.images[0]?.url} artistName={item?.owner?.display_name} /></SwiperSlide>
                                    })   
                            }
                            </Swiper>
                        </div>
                    </div>
                }
            </div>
    );
}

export default Search;


// gsap.to('main',{
    //     width: '64%',
    //     duration: 0.2
    // });
    
    
    // gsap.to('main',{
        //     width: '84%',
        //     duration: 0.2
        // });


        // axios.get('https://api.spotify.com/v1/search', {
        //     params: {
        //       'q': `${input}`,
        //       'type': 'track'
        //     },
        //     headers: {
        //       'Authorization': 'Bearer ' + props.token
        //     }
        // })
        // .then(response => {
        //     setSearchResult(response.data.tracks.items);
        //     console.log();
        // })