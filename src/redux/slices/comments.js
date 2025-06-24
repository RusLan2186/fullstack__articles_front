import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from '../../axios';

export const fetchLastComments = createAsyncThunk(
  'comments/fetchLastComments',
  async () => {
    const { data } = await axios.get('/comments/last');
    return data;
  }
);

const initialState = {
  items: [],
  status: 'loading'
}

const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {},
  extraReducers: {
    [fetchLastComments.pending]: (state) => {
      state.items = [];
      state.status = 'loading'
    },
    [fetchLastComments.fulfilled]: (state, action) => {
      state.items = action.payload;
      state.status = 'loaded'
    },
    [fetchLastComments.rejected]: (state) => {
      state.items = [];
      state.status = 'error'
    },
  }
})

export const commentsReducer = commentsSlice.reducer;