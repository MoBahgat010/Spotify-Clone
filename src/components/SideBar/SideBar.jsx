import Completelogo from '../../assets/Spotify.svg'
import Shortlogo from '../../assets/spotify-logo.png'
import LibraryIcon from '../../assets/LibraryIcon.png'
import './SideBar.css'
import { Link } from 'react-router-dom';
import LibraryCard from '../LibraryCard';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFollowedArtists, showCreatePlayListComponent } from '../../RTK/Slices/ComponentsSlices';
import { useMediaQuery } from 'react-responsive';
import LikedImage from "../../assets/Liked.jpg";
import LikedSongsCard from '../LikedSongsCard';

function SideBar(props) {

    const { UserId } = useSelector(state => state.Authorization);
    const dispatch = useDispatch();

    const isSmallScreen = useMediaQuery({ query: '(max-width: 640px)' })

    const [libraryData, setLibraryData] = useState([]);
    async function GetUserLibraryData() {
        const TrackResponse = await axios.get("https://api.spotify.com/v1/me/following?type=artist&limit=50",{
            headers: {
                'Authorization': 'Bearer ' + props.token,
            }
        })
        const PlayListResponse = await axios.get("https://api.spotify.com/v1/me/playlists" ,{
            headers: {
                'Authorization': 'Bearer ' + props.token,
            }
        })
        // const UsersPlayList = await axios.get(`https://api.spotify.com/v1/users/${UserId}/playlists`, {
        //     headers: {
        //         'Authorization': 'Bearer ' + props.token,
        //     }
        // })
        const LibraryData = [...TrackResponse.data.artists.items, ...PlayListResponse.data.items];
        let followedArtists = TrackResponse?.data?.artists?.items?.map(item => {
            return item.name;
        })
        dispatch(setFollowedArtists(followedArtists))
        setLibraryData(LibraryData);
    }
    useEffect(() => {
        GetUserLibraryData();
    },[props.token])
    return (
        <aside className="controls h-full lg:w-[270px] md:w-[190px] sm:w-[150px] w-[60px] pr-1">
            <div className='w-full h-full flex flex-col gap-0 rounded-md'>
                <div className="logo-container w-full md:px-2 px-1 flex justify-center lg:px-4 lg:py-1 bg-[#121212] rounded">
                    <img src={Completelogo} alt="" className='w-[11rem] h-[5rem] hidden md:block'/>
                    <img src={Shortlogo} alt="" className='w-[3rem] h-[3rem] sm:w-[4rem] sm:h-[4rem] md:p-2 p-1 object-contain block md:hidden'/>
                </div>
                <div className="home-search bg-[#121212] text-[#ADADAD] rounded mt-1 py-1 hover:scale-[1.01] duration-300">
                    <Link to={"/dashboard/home"} className='group flex justify-center my-2 md:m-0 md:block w-full py-3 lg:pl-4 md:pl-3 pl-2 lg:text-[16px] md:text-[14px] text-[12px] font-bold hover:cursor-pointer'>
                        <i className="fa-solid fa-house scale-150 md:scale-100 -translate-x-1 md:translate-x-0 md:group-hover:text-white duration-300 transition-all md:static relative after:absolute after:content-[''] after:top-[50%] after:left-[50%] after:translate-x-[-50%] after:translate-y-[-50%] after:rounded-full sm:after:w-[30px] sm:after:h-[30px] after:w-[24px] after:h-[24px] after:bg-[#333333a7] after:opacity-0 hover:after:opacity-100 after:-z-10 hover:cursor-pointer hover:text-white"></i>
                        <p className='hidden md:ml-5 md:inline group-hover:text-white'>Home</p>
                    </Link>
                    <Link to={"/dashboard/search"} className='group hover:cursor-pointer flex justify-center my-2 md:m-0 md:block w-full py-3 lg:pl-4 md:pl-3 pl-2 lg:text-[16px] md:text-[14px] text-[12px] font-bold'>
                        <i className="fa-solid fa-magnifying-glass scale-150 md:scale-100 -translate-x-1 md:translate-x-0 md:group-hover:text-white duration-300 transition-all md:static relative after:absolute after:content-[''] after:top-[50%] after:left-[50%] after:translate-x-[-50%] after:translate-y-[-50%] after:rounded-full sm:after:w-[30px] sm:after:h-[30px] after:w-[24px] after:h-[24px] after:bg-[#333333a7] after:opacity-0 hover:after:opacity-100 after:-z-10 hover:cursor-pointer hover:text-white"></i>
                        <p className='w-full hidden md:ml-5 md:inline group-hover:text-white'>Search</p>
                    </Link>
                </div>
                {/* <div className="input w-full h-[2.4rem] px-2">
                    <div className='flex items-center w-full h-full rounded-3xl bg-transparent border-[2px] border-[#ADADAD]'>
                        <i class="fa-solid hover:cursor-pointer fa-magnifying-glass scale-110 ml-1 text-[#ADADAD] p-2 border-r-2 border-[#ADADAD]"></i>
                        <input type="text" className='h-full w-full bg-transparent pl-[0.6rem] pr-[0.7rem] mb-[1.5px] placeholder:-translate-y-[1px] overflow-hidden outline-none text-[#ADADAD] text-[18px] placeholder:text-[16px]' placeholder='Search'/>
                    </div>
                </div> */}
                <div className="options mt-1 w-full bg-[#121212] rounded hover:scale-[1.01] duration-300 py-1 sm:py-0">
                    <ul className='text-[#ADADAD] w-full'>
                        <Link to={"/dashboard/variousTracks"} className='group hover:cursor-pointer flex justify-center my-2 md:m-0 md:block w-full py-3 lg:pl-4 md:pl-3 pl-2 lg:text-[16px] md:text-[14px] text-[12px] font-bold md:hover:bg-gradient-to-r hover:from-[#2D2D2D] hover:to-transparent'>
                            <i className="fa-solid fa-music scale-150 md:scale-100 -translate-x-1 md:translate-x-0 md:group-hover:text-white duration-300 transition-all md:static relative after:absolute after:content-[''] after:top-[50%] after:left-[50%] after:translate-x-[-50%] after:translate-y-[-50%] after:rounded-full sm:after:w-[30px] sm:after:h-[30px] after:w-[24px] after:h-[24px] after:bg-[#333333a7] after:opacity-0 hover:after:opacity-100 after:-z-10 hover:cursor-pointer hover:text-white"></i>
                            <p className='hidden md:ml-5 md:inline group-hover:text-white'>Tracks</p>
                        </Link>
                        <Link to={"/dashboard/variousAlbums"} className='group hover:cursor-pointer flex justify-center my-2 md:m-0 md:block w-full py-3 lg:pl-4 md:pl-3 pl-2 lg:text-[16px] md:text-[14px] text-[12px] font-bold md:hover:bg-gradient-to-r hover:from-[#2D2D2D] hover:to-transparent'>
                            <i className="fa-solid fa-record-vinyl scale-150 md:scale-100 -translate-x-1 md:translate-x-0 md:group-hover:text-white duration-300 transition-all md:static relative after:absolute after:content-[''] after:top-[50%] after:left-[50%] after:translate-x-[-50%] after:translate-y-[-50%] after:rounded-full sm:after:w-[30px] sm:after:h-[30px] after:w-[24px] after:h-[24px] after:bg-[#333333a7] after:opacity-0 hover:after:opacity-100 after:-z-10 hover:cursor-pointer hover:text-white"></i>
                            <p className='hidden md:ml-5 md:inline group-hover:text-white'>Albums</p>
                        </Link>
                        {/* <Link className='group hover:cursor-pointer flex justify-center my-2 md:m-0 md:block w-full py-3 lg:pl-4 md:pl-3 pl-2 lg:text-[16px] md:text-[14px] text-[12px] font-bold md:hover:bg-gradient-to-r hover:from-[#2D2D2D] hover:to-transparent'>
                            <i className="fa-solid fa-podcast scale-150 md:scale-100 -translate-x-1 md:translate-x-0 md:group-hover:text-white duration-300 transition-all md:static relative after:absolute after:content-[''] after:top-[50%] after:left-[50%] after:translate-x-[-50%] after:translate-y-[-50%] after:rounded-full sm:after:w-[30px] sm:after:h-[30px] after:w-[24px] after:h-[24px] after:bg-[#333333a7] after:opacity-0 hover:after:opacity-100 after:-z-10 hover:cursor-pointer hover:text-white"></i>
                            <p className='hidden md:ml-5 md:inline group-hover:text-white'>Podcast</p>
                        </Link>
                        <Link className='group hover:cursor-pointer flex justify-center my-2 md:m-0 md:block w-full py-3 lg:pl-4 md:pl-3 pl-2 lg:text-[16px] md:text-[14px] text-[12px] font-bold md:hover:bg-gradient-to-r hover:from-[#2D2D2D] hover:to-transparent'>
                            <i className="fa-solid fa-eye scale-150 md:scale-100 -translate-x-1 md:translate-x-0 md:group-hover:text-white duration-300 transition-all md:static relative after:absolute after:content-[''] after:top-[50%] after:left-[50%] after:translate-x-[-50%] after:translate-y-[-50%] after:rounded-full sm:after:w-[30px] sm:after:h-[30px] after:w-[24px] after:h-[24px] after:bg-[#333333a7] after:opacity-0 hover:after:opacity-100 after:-z-10 hover:cursor-pointer hover:text-white"></i>
                            <p className='hidden md:ml-5 md:inline group-hover:text-white'>Shows</p>
                        </Link> */}
                    </ul>
                </div>
                <div className="library overflow-auto flex-grow mt-1 w-full bg-[#121212] lg:px-4 md:px-3 sm:px-2 rounded hover:scale-[1.01] duration-300 py-1 sm:py-0">
                    <div className="head justify-evenly md:justify-between py-2 flex items-center">
                        <button className='group'>
                            <i className='fa-solid fa-book text-[#ADADAD] group-hover:text-white md:scale-100 lg:scale-125'></i>
                            <p className='hidden text-[#ADADAD] lg:text-[14px] md:text-[12px] font-bold md:ml-5 md:inline group-hover:text-white'>Your Library</p>
                        </button>
                    </div>
                    <div className='w-full relative h-[2rem] sm:h-fit cursor-pointer' onClick={() => {
                        dispatch(showCreatePlayListComponent());
                    }} >
                        {
                            isSmallScreen
                            ?
                                <p className='text-white absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-[30px]'>+</p>
                            :
                                <button className='hover:text-[#ADADAD] text-black duration-300 w-full rounded-3xl py-1 md:my-2 my-1 lg:text-[16px] md:text-[13px] sm:text-[10px] text-[8px] items-center hover:bg-transparent bg-white border-2 border-white'>Add Playlist</button>
                        }
                    </div>
                    <div className="library-data w-full">
                        <LikedSongsCard />
                        {
                            libraryData?.map(item => {
                                return <LibraryCard key={item.id} ItemID={item.id} name={item.name} type={item.type} image={item.images} />
                            })
                        }
                    </div>
                </div>
            </div>
        </aside>
    );
}

export default SideBar;