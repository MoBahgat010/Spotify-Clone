import AlternativeImage from "../assets/Spotify.svg"

function EpisodeCard(props) {
    return (
        <div className="non-artist-card p-3 group hover:bg-[#1A1A1A] rounded-lg hover:cursor-pointer">
            <div className="relative">
                <img className="w-[11.7rem] h-[11.7rem] object-cover rounded-lg" src={props.image == null ? AlternativeImage : props.image} alt="" />
                <i className="fa-solid fa-play scale-125 absolute right-[20%] bottom-[10%] after:z-[-1] opacity-0 group-hover:opacity-100 group-hover:bottom-[15%] after:absolute after:content-[''] after:top-[50%] after:rounded-full after:left-[50%] after:translate-x-[-54%] after:translate-y-[-50%] after:w-[2rem] after:h-[2rem] after:bg-[#1FDF62]"></i>
            </div>
            <div className="pt-3">
                <p className="pl-1 text-white line-clamp-1">{props.name}</p>
                <p className="text-[#ADADAD] pl-1 text-[14px] line-clamp-1">{props.artistName}</p>
            </div>
        </div>
    );
}

export default EpisodeCard;