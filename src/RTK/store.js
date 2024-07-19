import { configureStore } from "@reduxjs/toolkit";
import DashboardLayoutReducer from "./Slices/ComponentsSlices"
import AuthorizationReducer from "./Slices/AuthorizationSlice";
import MediaReducer from "./Slices/MediaSlice"

export const store = configureStore({
    reducer: {
        Dahboardlayout:  DashboardLayoutReducer,
        Authorization: AuthorizationReducer,
        Media: MediaReducer 
    }
})