import gsap from "gsap";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./Info.css"
import { HideInfoComponent } from "../../RTK/Slices/ComponentsSlices";
import TrackView from "../TrackView/TrackView";
import ArtistsCards from "../ArtistCard";
import AlbumCard from "../AlbumCard";
import PlayListCard from "../PlayListCard";
import EpisodeCard from "../EpisodeCard"
import PodCastCard from "../PodCastCard";

function Info() {
    const { infoComponent, infoComponentData} = useSelector(state => state.Dahboardlayout);
    const dispatch = useDispatch();
    const Info = useRef();
    // console.log(infoComponentData);

    function renderInfo() {
        if (infoComponent) {
            switch(infoComponentData[0].type) {
                case "track":
                    return (
                        <>
                            <div className="flex items-center">
                                <p className="text-white mr-auto text-[27px] font-bold mb-2">All Track</p>
                                <i className="fa-solid fa-x text-[#A3A3A3] cursor-pointer mb-2 mr-2" onClick={() => dispatch(HideInfoComponent())}></i>
                            </div>
                            {
                                infoComponentData.map((song , index) => {
                                    return <TrackView key={index} addToPlaylist={false} SongId={song.id} showAdd={true} name={song.name} duration={song.duration_ms / 1000} explicitMode={song.explicit} artistName={song.artists} showImage={true} showDuration={true} image={song.album.images[2].url} />
                                })
                            }
                        </>
                    )
                case "artist":
                    return (
                        <>
                            <div className="flex items-center">
                                <p className="text-white mr-auto text-[27px] font-bold mb-2">All Artists</p>
                                <i className="fa-solid fa-x text-[#A3A3A3] cursor-pointer mb-2 mr-2" onClick={() => dispatch(HideInfoComponent())}></i>
                            </div>
                            <div className="grid lg:grid-cols-2 grid-cols-1">
                                {
                                    infoComponentData.map(item => {
                                        return <ArtistsCards key={item?.id} artistID={item?.id} name={item?.name} image={item?.images[2]?.url} />
                                    })
                                }
                            </div>
                        </>
                    )
                case "album":
                    return (
                        <>
                            <div className="flex items-center">
                                <p className="text-white mr-auto text-[27px] font-bold mb-2">All Albums</p>
                                <i className="fa-solid fa-x text-[#A3A3A3] cursor-pointer mb-2 mr-2" onClick={() => dispatch(HideInfoComponent())}></i>
                            </div>
                            <div className="grid lg:grid-cols-2 grid-cols-1">
                                {
                                    infoComponentData.map(item => {
                                        return <AlbumCard key={item?.id} albumID={item?.id} date={item?.release_date} name={item?.name} image={item?.images[0]?.url} artistName={item?.artists[0]?.name} artistID={item?.artists[0]?.id} />
                                    })
                                }
                            </div>
                        </>
                    )
                case "playlist":
                    return (
                        <>
                            <div className="flex items-center">
                                <p className="text-white mr-auto text-[27px] font-bold mb-2">All Playlists</p>
                                <i className="fa-solid fa-x text-[#A3A3A3] cursor-pointer mb-2 mr-2" onClick={() => dispatch(HideInfoComponent())}></i>
                            </div>
                            <div className="grid lg:grid-cols-2 grid-cols-1">
                                {
                                    infoComponentData.map(item => {
                                        return <PlayListCard key={item?.id} playlistID={item?.id} name={item?.name} image={item?.images[0]?.url} artistName={item?.owner?.display_name} />
                                    })
                                }
                            </div>
                        </>
                    )
                case "episode":
                    return (
                        <>
                            <div className="flex items-center">
                                <p className="text-white mr-auto text-[27px] font-bold mb-2">All Episodes</p>
                                <i className="fa-solid fa-x text-[#A3A3A3] cursor-pointer mb-2 mr-2" onClick={() => dispatch(HideInfoComponent())}></i>
                            </div>
                            <div className="grid lg:grid-cols-2 grid-cols-1">
                                {
                                    infoComponentData.map(item => {
                                        return <EpisodeCard key={item?.id} name={item?.name} image={item?.images[0]?.url} artistName={item?.owner?.display_name} />
                                    })
                                }
                            </div>
                        </>
                    )
                case "show":
                    return (
                        <>
                            <div className="flex items-center">
                                <p className="text-white mr-auto text-[27px] font-bold mb-2">All PodCasts</p>
                                <i className="fa-solid fa-x text-[#A3A3A3] cursor-pointer mb-2 mr-2" onClick={() => dispatch(HideInfoComponent())}></i>
                            </div>
                            <div className="grid lg:grid-cols-2 grid-cols-1">
                                {
                                    infoComponentData.map(item => {
                                        return <PodCastCard key={item?.id} publisher={item.publisher} name={item?.name} image={item?.images[0]?.url} artistName={item?.owner?.display_name} />
                                    })
                                }
                            </div>
                        </>
                    )
            }    
        }
    }

    useEffect(() => {
        if (infoComponent) {
            gsap.to('.info',{
                width: "50%",
                duration: 0.2,
            });
            Info?.current?.classList?.add("active-info")
        }
        else {
            gsap.to('.info',{
                width: 0,
                duration: 0.2
            });          
            Info?.current?.classList?.remove("active-info")
        }
    })
    return (
        <aside className="info hidden md:block w-0 h-full overflow-auto pl-1">
            <div ref={Info} className="bg-[#121212] w-full h-full overflow-auto rounded-md">
                { renderInfo() }
            </div>
        </aside>
    );
}

export default Info;