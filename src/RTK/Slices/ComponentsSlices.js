import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    MediaComponent: localStorage.getItem("ShowMediaComponent") === null ? false : JSON.parse(localStorage.getItem("ShowMediaComponent")),
    infoComponent: false,
    prevSeeMoreClickedButton: null,
    infoComponentData: []
}

export const ComponentSlice = createSlice({
    initialState,
    name: 'ComponentslayOut',
    reducers: {
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
        
export const { ShowInfoComponent, HideInfoComponent, ShowMediaComponent, HideMediaComponent} = ComponentSlice.actions;
export default ComponentSlice.reducer;