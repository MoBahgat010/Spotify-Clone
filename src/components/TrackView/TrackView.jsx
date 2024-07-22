import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchSongData, setCurrenSongID } from "../../RTK/Slices/MediaSlice";
import { ShowMediaComponent } from "../../RTK/Slices/ComponentsSlices";
import AlternativeImage from "../../assets/Spotify.svg"
import "./TrackView.css"
import toast, { Toaster } from 'react-hot-toast';
import { addTrack, removeTrack } from "../../RTK/Slices/CreatePlayListSlice";

// const notify = () => toast('Here is your toast.');

function TrackView(props) {
    
    const { currentSongID, isSongPlaying } = useSelector(state => state.Media);
    const { accessToken } = useSelector(state => state.Authorization);
    const { addedTracks } = useSelector(state => state.playListAdd);
    const SelectedTrackView = useRef();
    
    const [isTrackSaved, setIsTrackSaved] = useState(false);
    
    const dispatch = useDispatch();
    const explicitSign = useRef();
    const ToAddTrack = useRef();
    const AddedTrack = useRef();

    async function CheckTrackIfSaved() {
        const response = await axios.get('https://api.spotify.com/v1/me/tracks/contains', {
            params: {
                'ids': props.SongId
            },
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        });
        // console.log(response.data[0]);
        if (response.data[0]) {
            AddedTrack.current.classList.add("track-saved");
        }
        else {
            ToAddTrack.current.classList.add("track-saved");
        }
        setIsTrackSaved(response.data[0]);
    }
    
    async function SaveTrack() {
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
                    'ids': props.SongId
                },
                headers: {
                    'Authorization': 'Bearer ' + accessToken,
                    'Content-Type': 'application/json'
                }
            }
        );
        ToAddTrack.current.classList.add("track-unsaved");
        ToAddTrack.current.classList.remove("track-saved");
        AddedTrack.current.classList.add("track-saved");
        AddedTrack.current.classList.remove("track-unsaved");
        toast.success("Track saved successfully", {
            autoClose: 2000,
            style: {
                background: 'green',
                color: '#fff',
            }
        });
        setIsTrackSaved(true);
    }
    
    async function UnSaveTrack() {
        const response = await axios.delete('https://api.spotify.com/v1/me/tracks', {
            params: {
                'ids': props.SongId
            },
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json'
            },
            // data: '{\n    "ids": [\n        "string"\n    ]\n}',
            data: {
                'ids': [
                    'string'
                ]
            }
        }); 
        AddedTrack.current.classList.add("track-unsaved");
        AddedTrack.current.classList.remove("track-saved");
        ToAddTrack.current.classList.add("track-saved");
        ToAddTrack.current.classList.remove("track-unsaved");
        toast.success("Track unsaved successfully", {
            autoClose: 2000,
            style: {
                background: 'green',
                color: '#fff',
            }
        });
        setIsTrackSaved(false);
    }

    function TimeStd(time) {
        let min = Math.floor(time / 60);
        let sec = Math.floor(time % 60);
        if (sec < 10) {
            sec = `0${sec}`
        }
        return `${min}:${sec}`
    }

    useEffect(() => {
        if(!props.explicitMode)
            explicitSign.current.classList.add("hidden");
        else 
        explicitSign.current.classList.remove("hidden");
},[]);

function ActivateSong(condition) {
    console.log(condition);
    if(condition) {
        console.log(addedTracks);
        let isAddedToPlaylist = false;
        for(let i = 0; i < addedTracks.length; i++) {
            console.log(addedTracks[i].SongId);
            if(addedTracks[i].SongId === props.SongId) {
                isAddedToPlaylist = true;
                break;
            }
        }       
        console.log(isAddedToPlaylist);
        if(isAddedToPlaylist) {
            dispatch(removeTrack(props.SongId))
            SelectedTrackView.current.classList.remove("added-tracks-to-playlist");
        } else {
            dispatch(addTrack(props))
            SelectedTrackView.current.classList.add("added-tracks-to-playlist");
        }
    } else {
        // console.log(props.SongId);
        dispatch(setCurrenSongID(props.SongId));
        dispatch(ShowMediaComponent());
        dispatch(fetchSongData());
    }
}

useEffect(() => {
    CheckTrackIfSaved();
    // console.log(isTrackSaved);
}, [isTrackSaved])

    return (
        <div ref={SelectedTrackView} className="track-view group bg-transparent flex items-center hover:bg-[#1b1b1b] p-1 py-2 rounded-lg cursor-pointer" onClick={() => {
            ActivateSong(props.addToPlaylist);
        }}>
            {
                props.showImage &&
                <div className="image-container group relative w-[3rem] h-[3rem] p-[0.2rem] mr-2" onClick={(e) => {
                    e.stopPropagation();
                    props.addToPlaylist ?
                        ActivateSong(!props.addToPlaylist)
                    :
                        ActivateSong(props.addToPlaylist)
                }}>
                    <img className="w-full h-full rounded" src={props.image == null ? AlternativeImage : props.image} alt="" />
                    {
                        props.SongId == currentSongID && isSongPlaying ?
                        <i className="fa-solid fa-pause absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-white"></i>
                        :
                        <i className="fa-solid fa-play hidden group-hover:inline-block absolute top-[50%] left-[53%] translate-x-[-50%] translate-y-[-50%] text-white"></i>
                    }
                </div>
            }
            <div className="track-info mr-auto text-white">
                <p className="lg:text-[14px] md:text-[12px] sm:text-[10px] text-[8.5px] line-clamp-1">{props.name}</p>
                <div className="flex items-center">
                    <div ref={explicitSign} className="explicit-tag text-black text-[8px] md:text-[10px] mr-[0.6rem] z-[5] relative after:absolute md:after:w-[18px] after:w-[14px] md:after:h-[18px] after:h-[14px] after:z-[-1] after:rounded after:top-[50%] after:left-[50%] after:translate-x-[-50%] after:translate-y-[-50%] after:bg-[#A9A9A9] p-[2px]">E</div>
                    <p className="line-clamp-1">
                        {
                            props.artistName.map((artist, index, array) => {
                                return (
                                    <>
                                        <Link onClick={(e) => { e.stopPropagation(); }} to={`/dashboard/artist/${artist.id}`} key={index} className="link lg:text-[14px] md:text-[12px] sm:text-[10px] text-[8.5px] text-[#ADADAD]">{artist.name}</Link>
                                        <span key={index}>{index < array.length - 1 ? ",    " : ""}</span>
                                    </>
                                )
                            })
                        }
                    </p>
                </div>
            </div>
            <div className="add-options mr-5 relative flex items-center" onClick={(e) => { 
                e.stopPropagation();
                console.log(isTrackSaved);
                isTrackSaved ? UnSaveTrack() : SaveTrack()
            }}>    
                {
                    props.showAdd &&
                    <div className="w-[1.5rem] h-[1.5rem] flex justify-center relative items-center mr-5"> 
                        <p ref={ToAddTrack} className="add-button hover:scale-110 duration-300 relative hover:cursor-pointer text-white after:absolute after:content-[''] after:top-[50%] after:left-[50%] after:w-[20px] after:h-[20px] after:translate-x-[-50%] after:translate-y-[-40%] after:invisible hidden group-hover:block group-hover:after:visible after:bg-transparent after:border-2 after:border-[#ADADAD] after:rounded-full" onClick={() => {
                        }}>+</p>
                        <i ref={AddedTrack} class="fa-solid scale-0 fa-check absolute top-[32%] left-[20%] translate-y-[-50%] after:absolute after:content-[''] after:top-[50%] after:left-[50%] after:w-[20px] after:h-[20px] after:translate-x-[-50%] after:translate-y-[-60%] after:bg-green-600 z-[1] after:z-[-1] after:rounded-full"></i>
                    </div>
                }
                {
                    props.showDuration &&
                    <p className="text-[#ADADAD]">{TimeStd(props.duration)}</p>
                }
            </div>
        </div>
    );
}

export default TrackView;