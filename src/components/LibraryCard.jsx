import { Link } from "react-router-dom";
import TestImage from "../assets/Spotify.svg"

function LibraryCard(props) {
    return (
        <div className="library-card md:py-2 py-1">
            <Link to={`/dashboard/${props.type}/${props.ItemID}`} className="w-full h-full">
                <div className='flex items-center '>
                    <div className="image-container lg:w-[30%] md:w-[40%] w-[100%] p-1 sm:p-0">
                        {
                            props.type == "artist" ?
                            <img className='aspect-square rounded-full w-full' src={props?.image[2]?.url} alt="" /> 
                            :
                            <img className='rounded-lg w-full' src={props?.image != null ? props?.image[0]?.url : TestImage} alt="" />
                        }
                    </div>
                    <div className="x-data lg:pl-3 md:pl-2 sm:pl-1 pl-0 lg:w-[70%] md:w-[60%] text-white hidden md:block">
                        <p className="md:text-[13px] text-[10px] line-clamp-1">{props.name}</p>
                        <p className='text-[#ADADAD] md:text-[11px] text-[9px] capitalize'>{props.type}</p>
                    </div>
                </div>
            </Link>
        </div>
    );
}

export default LibraryCard;