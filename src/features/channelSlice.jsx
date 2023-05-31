import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { selectServerId } from "./serverSlice.jsx";

const initialState = {
  serverId: null,
  channelsId: null,
  channelName: null,
};

export const channelSlice = createSlice({
  name: "channel",
  initialState,
  reducers: {
    setChannelInfo: (state, action) => {
        state.serverId = action.payload.serverId;
      state.channelsId = action.payload.channelsId;
      state.channelName = action.payload.channelName;
      console.log(state.channelName); 
    },
    resetChannelInfo: (state) => {
      state.channelsId = null;
      state.channelName = null;
    },
  },
});

export const { setChannelInfo, resetChannelInfo } = channelSlice.actions;

export const selectChannelId = (state) => state.channel.channelsId;
export const selectChannelName = (state) => state.channel.channelName;



export const resetChannel = () => (dispatch) => {
  dispatch(resetChannelInfo());
};

export default channelSlice.reducer;
