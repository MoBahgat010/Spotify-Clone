import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    isSongPlaying: false,
    // SongListIndexStart: -1,
    // SongListToPlay: [],
    currentSongID: localStorage.getItem("currentSongID") == null ? null : localStorage.getItem("currentSongID"),
    currentSongImage: localStorage.getItem("currentSongImage") == null ? null : localStorage.getItem("currentSongImage"),
    currentSongName: localStorage.getItem("currentSongName") == null ? "" : localStorage.getItem("currentSongName"),
    currentSongArtist: localStorage.getItem("currentSongArtist") == null ? [] : localStorage.getItem("currentSongArtist"),
    currentSongPreview: localStorage.getItem("currentSongPreview") == null ? "" : localStorage.getItem("currentSongPreview"),
    currentSongProgress: localStorage.getItem("currentSongProgress") == null ? 0 : localStorage.getItem("currentSongProgress"),
    SongVolume: localStorage.getItem("SongVolume") == null ? 50 : localStorage.getItem("SongVolume")
}

export const fetchSongData = createAsyncThunk("mediaSlice/fetchData", async (_,{ getState }) => {
    console.log("jkl only");
    const currentState = getState().Media;
    const accessToken = getState().Authorization.accessToken;
    const SpotifyResponse = await axios(`https://api.spotify.com/v1/tracks/${currentState.currentSongID}`,{
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
    });
    // console.log(SpotifyResponse);
    let song_name = SpotifyResponse.data.name;
    if(song_name.indexOf('(') != -1) {
        song_name = song_name.substring(0, song_name.indexOf('('));
        if(song_name.split("")[song_name.split("").length - 1] == " ") {
            song_name = song_name.slice(0, -1);
        }
    }
    let artist_name = SpotifyResponse.data.artists.map(artist => {
        return artist.name;
    })
    let song_image = SpotifyResponse.data.album.images[1].url;
    const DeezerResponse = await axios.get('https://deezerdevs-deezer.p.rapidapi.com/search', {
        params: {
          'q': `${song_name} ${artist_name.join(" ")}`
        },
        headers: {
          'x-rapidapi-key': '7d3d3edc5amsha7bf1930ad31f57p18dab4jsn61f0eb95d8e6',
          'x-rapidapi-host': 'deezerdevs-deezer.p.rapidapi.com'
        }
    });
    const previewObj = DeezerResponse.data.data.filter(item => {
        return item.title == song_name;
    });
    const preview = previewObj[0].preview;
    return { preview, song_image, song_name, artist_name};
});

export const MediaSlice = createSlice({
    initialState,
    name: "media",
    reducers: {
        // setSongListToPlay: (state, action) => {
        //     console.log("ooohyaaa", action.payload);
        //     state.SongListToPlay = [...action.payload.track];
        // },
        // PlayNextSong: (state, action) => {
        //     if(!state.SongListToPlay.length || state.SongListToPlay.length == state.SongListIndexStart - 1) {
        //         state.SongListIndexStart = -1
        //         console.log("I'm in MediaSlice jkl");
        //     }
        //     else {
        //         console.log("I'm in MediaSlice jkl");
        //         console.log("jkl", state.SongListToPlay);
        //         // const temp = state.SongListToPlay[state.SongListIndexStart + 1];
        //         setCurrenSongID(state.SongListToPlay[state.SongListIndexStart + 1]);
        //         state.SongListIndexStart++
        //         //  ShowMediaComponent()
        //         fetchSongData()
        //     }   
        // },
        setCurrentSongProgress: (state = initialState, action) => {
            state.currentSongProgress = action.payload;
            localStorage.setItem("currentSongProgress", state.currentSongProgress);
        },
        setSongPlaying: (state, action) => {
            state.isSongPlaying = action.payload;
        },
        setCurrenSongID: (state = initialState, action) => {
            console.log(action.payload);
            console.log(action.payload != null);
            if(action.payload != null)  
                if(state.currentSongID == action.payload) 
                    state.isSongPlaying = !state.isSongPlaying;
                else
                    state.isSongPlaying = true;
            else
                state.isSongPlaying = false
            state.currentSongID = action.payload;
            localStorage.setItem("currentSongID", state.currentSongID);
            localStorage.setItem("isSongPlaying", state.isSongPlaying);
        },
        setSongVolume: (state = initialState, action) => {
            state.SongVolume = action.payload;
            localStorage.setItem("SongVolume", action.payload);
        }
    },
    extraReducers: builder => {
        builder.addCase(fetchSongData.fulfilled, (state = initialState, action) => {
            console.log(action.payload);
            state.currentSongImage = action.payload.song_image;
            state.currentSongName = action.payload.song_name;
            state.currentSongArtist = action.payload.artist_name.join(", ");
            state.currentSongPreview = action.payload.preview; 
            localStorage.setItem("currentSongImage", state.currentSongImage);           
            localStorage.setItem("currentSongName", state.currentSongName);           
            localStorage.setItem("currentSongArtist", state.currentSongArtist);           
            localStorage.setItem("currentSongPreview", state.currentSongPreview);           
        })
    }
});

export const { setSongVolume, setCurrenSongID, setSongPlaying, setCurrentSongProgress, setSongListToPlay, PlayNextSong } = MediaSlice.actions;
export default MediaSlice.reducer;