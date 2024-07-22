import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    FollowedArtists: [],
    MediaComponent: localStorage.getItem("ShowMediaComponent") === null ? false : JSON.parse(localStorage.getItem("ShowMediaComponent")),
    infoComponent: false,
    createPlayListComponent: false,
    prevSeeMoreClickedButton: null,
    infoComponentData: []
}

export const ComponentSlice = createSlice({
    initialState,
    name: 'ComponentslayOut',
    reducers: {
        showCreatePlayListComponent: (state = initialState) => {
            state.createPlayListComponent = true
        },
        hideCreatePlayListComponent: (state = initialState) => {
            state.createPlayListComponent = false
        },
        setFollowedArtists: (state = initialState, action) => {
            state.FollowedArtists = [...action.payload]
        },
        ShowInfoComponent: (state = initialState, action) => { 
            state.infoComponentData = [...action.payload.data];
            state.prevSeeMoreClickedButton = action.payload.ele;
            state.infoComponent = true; 
        },
        HideInfoComponent: (state = initialState) => { 
            state.infoComponentData = [];
            state.prevSeeMoreClickedButton = null;
            state.infoComponent = false; 
        },
        ShowMediaComponent: (state = initialState) => { 
            localStorage.setItem("ShowMediaComponent", true);
            state.MediaComponent = true; 
        },
        HideMediaComponent: (state = initialState) => {
            state.MediaComponent = false; 
            localStorage.setItem("ShowMediaComponent", false);
        }
    }
});
        
export const { ShowInfoComponent, HideInfoComponent, ShowMediaComponent, HideMediaComponent, setFollowedArtists, showCreatePlayListComponent, hideCreatePlayListComponent} = ComponentSlice.actions;
export default ComponentSlice.reducer;