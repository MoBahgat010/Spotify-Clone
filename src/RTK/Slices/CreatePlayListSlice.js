import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    addedTracks: []
}

export const CreatePlayListSlice = createSlice({
    name: 'createPlayList',
    initialState,
    reducers: {
        addTrack: (state = initialState, action) => {
            state.addedTracks.push(action.payload)
        },
        removeTrack: (state = initialState, action) => {
            state.addedTracks = state.addedTracks.filter(track => track.SongId != action.payload)
        }
    }
})

export const { addTrack, removeTrack } = CreatePlayListSlice.actions
export default CreatePlayListSlice.reducer