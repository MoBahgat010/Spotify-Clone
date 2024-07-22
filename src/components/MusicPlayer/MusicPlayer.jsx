import { useRef, useState } from 'react';
import './MusicPlayer.css'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PlayNextSong, setCurrenSongID, setCurrentSongProgress, setSongPlaying, setSongVolume } from '../../RTK/Slices/MediaSlice';
import { HideMediaComponent } from '../../RTK/Slices/ComponentsSlices';
import axios from 'axios';
import toast from 'react-hot-toast';

function MusicPlayer() {

    const { currentSongImage, currentSongName, currentSongArtist, currentSongPreview, isSongPlaying, SongVolume, currentSongProgress, currentSongID } = useSelector(state => state.Media);
    const { accessToken } = useSelector(state => state.Authorization);
    // const { MediaComponent } = useSelector(state => state.Dahboardlayout)
    const dispatch = useDispatch();
    
    // const [Songduration ,setSongDuration] = useState(0);
    const [playTime, setPlayTime] = useState(0);
    const [isTrackSaved, setIsTrackSaved] = useState(false);
    const LikeSong = useRef();
    
    // let isPlaying = false;
    // let PlayTimeAid = playTime;
    // let SongInterval;

    const MucicProgressBar = useRef();
    const SoundBar = useRef();
    const MusicRangeInp = useRef();
    const SoundRangeInp = useRef();
    const PlayButton = useRef();
    const PauseButton = useRef();
    const Song = useRef(null);
    
    function TimeStd(time) {
        let min = Math.floor(time / 60);
        let sec = Math.floor(time % 60);
        if (sec < 10) {
            sec = `0${sec}`
        }
        return `${min}:${sec}`
    }   

    function PlaySong() {
        Song.current.play();
        PlayButton.current.classList.add('hidden');
        PauseButton.current.classList.remove('hidden');
        dispatch(setSongPlaying(true));
    }
    
    function PauseSong() {
        Song.current.pause();
        PlayButton.current.classList.remove('hidden');
        PauseButton.current.classList.add('hidden');
        dispatch(setSongPlaying(false));
    }

    function Increment10Seconds() {
        Song.current.currentTime > 10 ? Song.current.currentTime -= 10 : Song.current.currentTime = 0
        setPlayTime(Song.current.currentTime);
    }

    function Decrement10Seconds() {
        Song.current.currentTime < Song.current.duration - 10 ? Song.current.currentTime += 10 : Song.current.currentTime = Song.current.duration;
    }

    async function CheckTrackIfSaved() {
        console.log(accessToken);
        const response = await axios.get('https://api.spotify.com/v1/me/tracks/contains', {
            params: {
              'ids': currentSongID
            },
            headers: {
              'Authorization': 'Bearer ' + accessToken
            }
        });
        console.log(response.data[0]);
        if (response.data[0]) {
            LikeSong.current.classList.remove("icon-container-deactive");
            LikeSong.current.classList.add("icon-container-active");
        }
        else {
            LikeSong.current.classList.add("icon-container-deactive");
            LikeSong.current.classList.remove("icon-container-active");
        }
        setIsTrackSaved(response.data[0]);
    }

    async function SaveTracks() {
        const response = await axios.put(
            'https://api.spotify.com/v1/me/tracks',
            // '{\n    "ids": [\n        "string"\n    ]\n}',
            {
              'ids': [
                'string'
              ]
            },
            {
              params: {
                'ids': currentSongID
              },
              headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json'
              }
            }
        );
        setIsTrackSaved(true);
        toast.success("Track saved successfully", {
            autoClose: 2000,
            style: {
                background: 'green',
                color: '#fff',
            }
        });
        LikeSong.current.classList.remove("icon-container-deactive");
        LikeSong.current.classList.add("icon-container-active");
    }
    
    async function RemoveSavedTracks() {
        const response = await axios.delete('https://api.spotify.com/v1/me/tracks', {
            params: {
                'ids': currentSongID
            },
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json'
            },
            data: {
                'ids': [
                    'string'
                ]
            }
        });
        setIsTrackSaved(false);
        toast.success("Track unsaved successfully", {
            autoClose: 2000,
            style: {
                background: 'green',
                color: '#fff',
            }
        });
        LikeSong.current.classList.add("icon-container-deactive");
        LikeSong.current.classList.remove("icon-container-active");
    }
    
    useEffect(() => {
        // console.log(currentSongProgress);
        PlaySong();
        CheckTrackIfSaved();
        SoundBar.current.style.width = SongVolume + "%"
        SoundRangeInp.current.value = SongVolume;
        Song.current.volume = SongVolume / 100;
    }, [currentSongPreview])
    
    useEffect(() => {
        isSongPlaying ? PlaySong() : PauseSong();
    }, [isSongPlaying])
    
    useEffect(() => {
        Song.current.currentTime = currentSongProgress;
        console.log(isTrackSaved);
    }, [])
    
    useEffect(() => {
        CheckTrackIfSaved();
    }, [accessToken])

    // function onAudioEnd() {
    //     console.log("I'm in MediaSlice jkl");
    //     dispatch(PlayNextSong());
    // }   

    // useEffect(() => {
    //     if(SongListIndexStart == -1) {
            
    //         console.log("I'm in MediaSlice jkl");
    //     }
    // }, [SongListIndexStart])

    // dispatch(setCurrenSongID(currentSongID));
    
    return (
        <section className="music-player relative rounded-md">
            <audio ref={Song} className='absolute invisible' src={currentSongPreview} controls onEnded={() => {
                MucicProgressBar.current.style.width = "0"
                dispatch(setSongPlaying(false))  
            }} onTimeUpdate={() => {
                MucicProgressBar.current.style.width = Song.current.currentTime / Song.current.duration * 100 + "%";
                dispatch(setCurrentSongProgress(Song.current.currentTime));
                setPlayTime(Song.current.currentTime);
            }}></audio>
            <i className="fa-solid fa-x absolute md:top-3 sm:top-2 top-1 md:right-2 sm:right-1 right-0 sm:scale-75 scale-50 text-[#A3A3A3] cursor-pointer mb-2 mr-2" onClick={() => {
                dispatch(HideMediaComponent(false))
                dispatch(setCurrenSongID(null))
                PauseSong()
                Song.current.currentTime = 0
            }}></i>
            <div className="progress-container w-full relative h-[3px] bg-gray-600">
                <div ref={MucicProgressBar} className="progress-bar w-[0] h-[100%] rounded-r bg-white"></div>
                <input id='music-progress-bar-input' ref={MusicRangeInp} type="range" className='bg-transparent' min={0} max={100} onInput={() => {
                    Song.current.currentTime = MusicRangeInp.current.value / 100 * Song.current.duration;
                    MucicProgressBar.current.style.width = MusicRangeInp.current.value + "%";
                    PlaySong();
                }} />
            </div>
            <div className='track-data flex items-center w-full justify-between lg:p-4 md:p-3 sm:p-2 p-1'>
                <div className='flex items-center'>
                    <div className="image-container md:pr-2 pr-1">
                        <img className='lg:w-[60px] md:w-[45px] w-[40px] lg:h-[60px] md:h-[45px] h-[40px] rounded' src={currentSongImage} alt="track image" />
                    </div>
                    <div className='px-0 md:px-1 w-[2.5rem] sm:w-[5rem] md:w-[7rem] lg:w-[10rem]'>
                        <p className='text-white text-[10px] md:text-[12px] lg:text-[16px] mb-1 w-full md:w-full line-clamp-1'>{currentSongName}</p>
                        <p className='lg:text-[10px] text-[8px] text-[#ADADAD] line-clamp-1'>{currentSongArtist}</p>
                    </div>
                    <div className="icon-container lg:ml-4 md:ml-3 sm:ml-2 ml-1 flex lg:pl-5 md:pl-4 sm:pl-3 pl-5 relative">
                        <i className="fa-regular fa-heart absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-white lg:scale-150 md:scale-110 sm:scale-105 scale-100"></i>
                        <i ref={LikeSong} className="fa-solid cursor-pointer fa-heart absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-white lg:scale-150 md:scale-110 sm:scale-105 scale-100" onClick={(e) => {
                            console.log(isTrackSaved);
                            isTrackSaved ? RemoveSavedTracks() : SaveTracks();
                        }}></i>
                    </div>
                </div>
                <div className="player-controls flex items-center">
                    <i className="fa-solid lg:pr-4 md:pr-3 sm:pr-2 pr-1 text-[#ADADAD] fa-shuffle hover:cursor-pointer"></i>
                    <button className='lg:mx-8 md:mx-6 sm:mx-3 mx-1 hover:cursor-pointer' onClick={() => {
                        Increment10Seconds();
                    }}>
                        <i className="fa-solid fa-caret-left lg:scale-150 md:scale-110 scale-100 text-white"></i>
                        <i className="fa-solid fa-caret-left lg:scale-150 md:scale-110 scale-100 text-white"></i>
                    </button>
                    <button className="play-pause lg:w-[45px] md:w-[35px] sm:w-[30px] w-[25px] lg:h-[45px] md:h-[35px] sm:h-[30px] h-[25px] bg-white rounded-full relative" onClick={() => {
                        console.log("Clicked Man");
                        isSongPlaying ? PauseSong() : PlaySong();
                        // !PlayButton.current.classList.contains('hidden') ? dispatch(setSongPlaying(true)) : dispatch(setSongPlaying(false));
                    }}>
                        <i ref={PlayButton} className="fa-solid md:scale-125 sm:scale-110 scale-95 absolute top-[50%] left-[53%] translate-x-[-50%] translate-y-[-50%] fa-play text-black"></i>
                        <i ref={PauseButton} className="fa-solid hidden md:scale-125 sm:scale-110 scale-95 absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] fa-pause text-black"></i>
                    </button>
                    <button className='lg:mx-8 md:mx-6 sm:mx-3 mx-1 hover:cursor-pointer' onClick={() => {
                        Decrement10Seconds();
                    }}>
                        <i className="fa-solid fa-caret-right text-white lg:scale-150 md:scale-110 scale-100"></i>
                        <i className="fa-solid fa-caret-right text-white lg:scale-150 md:scale-110 scale-100"></i>
                    </button>
                    <i className="fa-solid lg:pl-4 md:pl-3 sm:pl-2 pl-1 fa-reply text-white hover:cursor-pointer" onClick={() => {
                        Song.current.currentTime = 0;
                        PauseSong();
                    }}></i>
                </div>
                <div className='flex items-center'>
                    <p className='text-white text-[10px] md:text-[12px] lg:text-[16px]'>{Song != null && TimeStd(playTime)} / {Song != null && TimeStd(Song?.current?.duration)}</p>
                    <i className="fa-solid fa-music text-white scale-90 sm:scale-100 lg:pl-5 md:pl-4 sm:pl-3 pl-2 lg:pr-3 md:pr-2 pr-1"></i>
                    <div className="sound-bar-container relative lg:w-[70px] md:w-[45px] w-[30px] h-[3px] bg-gray-600">
                        <div ref={SoundBar} className="progress-bar w-[50%] h-[100%] rounded-r bg-white"></div>                
                        <input ref={SoundRangeInp} id='sound-bar-input' type="range" className='absolute inset-0' defaultValue={50} min={0} max={100} onMouseUp={() => dispatch(setSongVolume(SoundRangeInp.current.value))} onInput={() => {
                            SoundBar.current.style.width = SoundRangeInp.current.value + '%';
                            Song.current.volume = SoundRangeInp.current.value / 100;
                        }}/>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default MusicPlayer;