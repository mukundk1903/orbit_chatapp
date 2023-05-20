import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    serverId:null,
    serverName:null,
    serverImg:null,
};

export const serverSlice = createSlice({
    name:"server",
    initialState,
    reducers:{
        setServerInfo:(state, action) => {
             state.serverId = action.payload.serverId;
             state.serverName = action.payload.serverName;
             state.serverImg = action.payload.serverImg;
        },
    },
});

export const {setServerInfo} = serverSlice.actions;

export const selectServerId = (state) => state.server.serverId;
export const selectServerName = (state) => state.server.serverName;

export default serverSlice.reducer;