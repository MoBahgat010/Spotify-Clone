import { Link } from "react-router-dom";
import AlternativeImage from "../assets/Spotify.svg"

// import "./TopResults.css"

function TopResults(props) {
    return (
        <Link to={`/dashboard/playlist/${props.playlistID}`} className="top-results px-3">
            <div className="group relative z-10 inner-container hover:bg-[#282828] hover:cursor-pointer duration-300 rounded-lg bg-[#1b1b1b] px-7 py-5">
                <img className="w-[6rem] h-[6rem] rounded" src={props.image == null ? AlternativeImage : props.image} alt="" />
                <p className="playlist-name text-[18px] sm:text-[23px] md:text-[27px] lg:text-[30px] font-bold mt-3 text-white line-clamp-2">{props.name}</p>
                <div className="text-white flex">
                    <p className="inline mr-5 capitalize text-[#ADADAD]">PlayLists</p>
                    <p className="line-clamp-1">
                        <Link className="link overflow-hidden text-ellipsis whitespace-nowrap">{props.artistName}</Link>
                    </p>
                </div>
                <i className="fa-solid scale-125 fa-play absolute right-[10%] bottom-[10%] after:z-[-1] opacity-0 group-hover:opacity-100 group-hover:bottom-[15%] after:absolute after:content-[''] after:top-[50%] after:rounded-full after:left-[50%] after:translate-x-[-54%] after:translate-y-[-50%] after:w-[2rem] after:h-[2rem] after:bg-[#1FDF62]"></i>
            </div>
        </Link>
    )
}

export default TopResults;