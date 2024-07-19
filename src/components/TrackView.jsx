import axios from "axios";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchSongData, setCurrenSongID } from "../RTK/Slices/MediaSlice";
import { ShowMediaComponent } from "../RTK/Slices/ComponentsSlices";
import AlternativeImage from "../assets/Spotify.svg"

function TrackView(props) {

    const { currentSongID, isSongPlaying } = useSelector(state => state.Media);

    const dispatch = useDispatch();
    const explicitSign = useRef();

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
                'Authorization': 'Bearer 1POdFZRZbvb...qqillRxMr2z',
                'Content-Type': 'application/json'
              }
            }
          );
    }

    async function UnSaveTrack() {
        const response = await axios.delete('https://api.spotify.com/v1/me/tracks', {
            params: {
              'ids': props.SongId
            },
            headers: {
              'Authorization': 'Bearer 1POdFZRZbvb...qqillRxMr2z',
              'Content-Type': 'application/json'
            },
            // data: '{\n    "ids": [\n        "string"\n    ]\n}',
            data: {
              'ids': [
                'string'
              ]
            }
        });     
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

    return (
        <div className="track-view group bg-transparent flex items-center hover:bg-[#1b1b1b] p-1 py-2 rounded-lg cursor-pointer" onClick={() => {
            console.log(props.SongId);
            dispatch(setCurrenSongID(props.SongId));
            dispatch(ShowMediaComponent());
            dispatch(fetchSongData());
        }}>
            {
                props.showImage &&
                <div className="image-container group relative w-[3rem] h-[3rem] p-[0.2rem] mr-2">
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
                                        <Link to={`/dashboard/artist/${artist.id}`} key={index} className="link lg:text-[14px] md:text-[12px] sm:text-[10px] text-[8.5px] text-[#ADADAD]">{artist.name}</Link>
                                        <span key={index}>{index < array.length - 1 ? ",    " : ""}</span>
                                    </>
                                )
                            })
                        }
                    </p>
                </div>
            </div>
            <div className="mr-5 relative flex">    
                {/* <i class="fa-solid fa-check absolute top-[50%] translate-y-[-24.6%] translate-x-[-12%] after:absolute after:content-[''] after:top-[50%] after:left-[50%] after:w-[20px] after:h-[20px] after:translate-x-[-50%] after:translate-y-[-60%] after:bg-green-600 z-[1] after:z-[-1] after:rounded-full"></i> */}
                {
                    props.showAdd &&
                    <p className="add-button relative hover:cursor-pointer text-white mr-5 after:absolute after:content-[''] after:top-[50%] after:left-[50%] after:w-[20px] after:h-[20px] after:translate-x-[-50%] after:translate-y-[-40%] after:invisible invisible group-hover:visible group-hover:after:visible after:bg-transparent after:border-2 after:border-[#ADADAD] after:rounded-full" onClick={() => {
                    }}>+</p>
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