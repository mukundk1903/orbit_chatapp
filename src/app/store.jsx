import { configureStore } from "@reduxjs/toolkit";
import channelReducer from "../features/channelSlice.jsx";

export const store = configureStore({
    reducer:{
        channel:channelReducer,
    },
});