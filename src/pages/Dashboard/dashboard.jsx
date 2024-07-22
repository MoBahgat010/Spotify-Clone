import { useEffect, useRef, useState } from "react";
import Info from "../../components/Info/Info";
import Main from "../../components/Main/Search/Search";
import MusicPlayer from "../../components/MusicPlayer/MusicPlayer";
import SideBar from "../../components/SideBar/SideBar";
import './dashboard.css'
import Search from "../../components/Main/Search/Search";
import { Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { GetAccessToken } from "../../RTK/Slices/AuthorizationSlice";
import ArtistPage from "../../components/Main/Artist/ArtistPage";
import AlbumPage from "../../components/Main/Album/AlbumPage";
import gsap from "gsap";
import PlayListPage from "../../components/Main/PlayList/PlayListPage";
import Home from "../../components/Main/Home/Home";
import { useMediaQuery } from "react-responsive";
import Track from "../../components/Main/Track";
import Albums from "../../components/Main/Albums";
import CreatePlayList from "../../components/Main/CreatePlayList";

function Dashboard() {

  const { MediaComponent } = useSelector(state => state.Dahboardlayout);
  const { accessToken, UserName, UserImage, UserMail, UserCountry } = useSelector(state => state.Authorization);
  const UpperPage = useRef();
  
  const dispatch = useDispatch();

  const VerySmallScreen = useMediaQuery({ query: '(min-width: 640px)' });
  const MediumScreen = useMediaQuery({ query: '(min-width: 768px)' });
  const LargeScreen = useMediaQuery({ query: '(min-width: 1024px)' });

 
  
  useEffect(() => {
    dispatch(GetAccessToken());
  },[accessToken]);

  useEffect(() => {
    if(MediaComponent) {
      if(!VerySmallScreen) { //below sm
          gsap.to(".upper-page", {
            duration: 0.5,
            height: "92.3%",
            paddingBottom: "0.25rem"
          });
          gsap.to(".media-player", {
            duration: 0.5,
            height: "auto",
          })
        }
      else if(!MediumScreen) { //between sm and md
        gsap.to(".upper-page", {
          duration: 0.5,
          height: "90.8%",
          paddingBottom: "0"
        });
        gsap.to(".media-player", {
          duration: 0.5,
          height: "auto",
        })
      }    
      else if(!LargeScreen) { // between md and lg
        gsap.to(".upper-page", {
          duration: 0.5,
          height: "88.8%",
          paddingBottom: "0"
        });
        gsap.to(".media-player", {
          duration: 0.5,
          height: "auto",
        })
      }
      else { // above lg
        gsap.to(".upper-page", {
          duration: 0.5,
          height: "85.5%",
          paddingBottom: "0"
        });
        gsap.to(".media-player", {
          duration: 0.5,
          height: "auto",
        })
      }
    } else {
      gsap.to(".upper-page", {
        duration: 0.5,
        height: "100%",
        paddingBottom: "0"
      });
      gsap.to(".media-player", {
        duration: 0.5,
        height: "0",
      })
    }
  })


  useEffect(() => {
    if(MediaComponent) {
      if(!VerySmallScreen) { //below sm
          gsap.set(".upper-page", {
            duration: 0.5,
            height: "92.3%",
            paddingBottom: "0.25rem"
          });
          gsap.set(".media-player", {
            duration: 0.5,
            height: "auto",
          })
        }
      else if(!MediumScreen) { //between sm and md
        gsap.set(".upper-page", {
          duration: 0.5,
          height: "90.8%",
          paddingBottom: "0"
        });
        gsap.set(".media-player", {
          duration: 0.5,
          height: "auto",
        })
      }    
      else if(!LargeScreen) { // between md and lg
        gsap.set(".upper-page", {
          duration: 0.5,
          height: "88.8%",
          paddingBottom: "0"
        });
        gsap.set(".media-player", {
          duration: 0.5,
          height: "auto",
        })
      }
      else { // above lg
        gsap.set(".upper-page", {
          duration: 0.5,
          height: "85.5%",
          paddingBottom: "0"
        });
        gsap.set(".media-player", {
          duration: 0.5,
          height: "auto",
        })
      }
    } else {
      gsap.set(".upper-page", {
        duration: 0.5,
        height: "100%",
        paddingBottom: "0"
      });
      gsap.set(".media-player", {
        duration: 0.5,
        height: "0",
      })
    }
  },[])

    
  return (
        <div className='bg-black w-full h-[100dvh] p-1'>
          <CreatePlayList token={accessToken} />
          <div className="w-full dashboard h-full">
            <div ref={UpperPage} className='upper-page w-full h-full pb-1 flex'>
              {/* <button className="bg-white" onClick={() => {
                MediaComponent ? dispatch(HideMediaComponent(false)) : dispatch(ShowMediaComponent(true))
              }}>CLick Me</button> */}
              <SideBar token={accessToken} />
              <div className="main-page w-full bg-[#151515de] rounded overflow-auto">
                <Routes>
                  <Route path="home" element={<Home token={accessToken} image={UserImage[1]?.url} />} />           
                  <Route path="search" element={<Search token={accessToken} image={UserImage[1]?.url} />} />           
                  <Route path="variousTracks" element={<Track token={accessToken} />} />           
                  <Route path="variousAlbums" element={<Albums token={accessToken} />} />           
                  <Route path="artist/:artistID" element={<ArtistPage token={accessToken} />} />   
                  <Route path="album/:albumID" element={<AlbumPage token={accessToken} />} />
                  <Route path="playlist/:playlistID" element={<PlayListPage token={accessToken} />} />
                </Routes>
              </div>
              <Info />
            </div>
            <div className='media-player sticky top-[100%] rounded-md overflow-hidden w-full'>
              <MusicPlayer />
            </div>
          </div>
        </div>
  );
}

export default Dashboard;