import { Link } from 'react-router-dom';
import AlternativeImage from "../assets/Spotify.svg"

function ArtistsCards(props) {
    return (
        <div className='hover:bg-[#1A1A1A] hover:cursor-pointer p-2 py-3 rounded-lg group'>
            <Link to={`/dashboard/artist/${props.artistID}`} className="artist w-full">
                <div className="image-conatiner relative flex justify-center rounded">
                    <img className="rounded-full aspect-square object-cover w-full h-full" src={props.image == null ? AlternativeImage : props.image} alt="image" />
                    <i className="fa-solid fa-play scale-125 absolute right-[20%] bottom-[10%] after:z-[-1] opacity-0 group-hover:opacity-100 group-hover:bottom-[15%] after:absolute after:content-[''] after:top-[50%] after:rounded-full after:left-[50%] after:translate-x-[-54%] after:translate-y-[-50%] after:w-[2rem] after:h-[2rem] after:bg-[#1FDF62]"></i>
                </div>
                <p className="text-white lg:text-[16px] md:text-[14px] sm:text-[12px] mt-2 ml-2">{props.name}</p>
                <p className="text-[#ADADAD] ml-2 lg:text-[16px] md:text-[14px] sm:text-[12px]">Artist</p>
            </Link>
        </div>
    );
}

export default ArtistsCards;