import { configureStore } from "@reduxjs/toolkit";
import channelReducer from "../features/channelSlice.jsx";
import serverReducer from "../features/serverSlice.jsx"


export const store = configureStore({
    reducer:{
        channel:channelReducer,
        server: serverReducer,
    },
});