import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    accessToken: null,
    UserCountry: null,
    UserName: null,
    UserMail: null,
    UserId: null,
    UserImage: [{}]
}


async function GetUserData(token) {
    try {
        const response = await axios.get('https://api.spotify.com/v1/me', {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        })
        return { response, token };
    }
    catch {
        console.log("Error");
    }
}

export const GetAccessToken = createAsyncThunk("AuthorizationSlice/getAccessToken", async () => {
    const hash = window.location.hash;
    if(hash != '') {
        let token = hash.substring(1).split("&")[0].split("=")[1];
        console.log(token);
        localStorage.setItem('accessToken', token);
        return GetUserData(token);
    }
    else {
        return GetUserData(localStorage.getItem('accessToken'));
    }
});

export const AuthorizationSlice = createSlice({
    initialState,
    name: 'Authorization',
    extraReducers: builder => {
        builder.addCase(GetAccessToken.fulfilled, (state = initialState, action) => {
            state.accessToken = action.payload.token;
            state.UserCountry = action.payload.response.data.country;
            state.UserMail = action.payload.response.data.email;
            state.UserName = action.payload.response.data.display_name;
            state.UserId = action.payload.response.data.id
            state.UserImage = action.payload.response.data.images;
        })
    }
});
        
export default AuthorizationSlice.reducer;