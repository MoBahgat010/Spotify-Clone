import { Link } from "react-router-dom";
import LikedImage from "../assets/Liked.jpg";

function LikedSongsCard(props) {
    return (
        <div className="library-card md:py-2 py-1">
            <Link to={"/dashboard/likedsongs"} className="w-full h-full">
                <div className='flex items-center '>
                    <div className="image-container lg:w-[30%] md:w-[40%] w-[100%] p-1 sm:p-0">
                        <img className='rounded-lg w-full' src={LikedImage} alt="" />
                    </div>
                    <div className="x-data lg:pl-3 md:pl-2 sm:pl-1 pl-0 lg:w-[70%] md:w-[60%] text-white hidden md:block">
                        <p className="md:text-[13px] text-[10px] line-clamp-1">Liked Songs</p>
                        <p className='text-[#ADADAD] md:text-[11px] text-[9px] capitalize'>Playlist</p>
                    </div>
                </div>
            </Link>
        </div>
    );
}

export default LikedSongsCard;