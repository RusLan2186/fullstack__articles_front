import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from '../../axios';

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const { data } = await axios.get('/posts')

  return data
})

export const fetchRemovePosts = createAsyncThunk('posts/fetchRemovePosts', async (id) => {
  await axios.delete(`/posts/${id}`)
})


export const fetchTags = createAsyncThunk('posts/fetchTags', async () => {
  const { data } = await axios.get('/tags')

  return data
})

export const fetchPopularPosts = createAsyncThunk('posts/fetchPopularPosts', async () => {
  const { data } = await axios.get('/posts/popular');
  return data;
});


const initialState = {
  posts: {
    items: [],
    status: 'loading'
  },
  tags: {
    items: [],
    status: 'loading'
  }
}

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers: {
    [fetchPosts.pending]: (state) => {
      state.posts.items = [];
      state.posts.status = 'loading'
    },
    [fetchPosts.fulfilled]: (state, action) => {
      state.posts.items = action.payload;
      state.posts.status = 'loaded'
    },
    [fetchPosts.rejected]: (state) => {
      state.posts.items = [];
      state.posts.status = 'error'
    },

    [fetchTags.pending]: (state) => {
      state.tags.items = [];
      state.tags.status = 'loading'
    },
    [fetchTags.fulfilled]: (state, action) => {
      state.tags.items = action.payload;
      state.tags.status = 'loaded'
    },
    [fetchTags.rejected]: (state) => {
      state.tags.items = [];
      state.tags.status = 'error'
    },

    [fetchRemovePosts.pending]: (state, action) => {
      state.posts.items = state.posts.items.filter(post => post._id === action.meta.arg);
    },

    [fetchPopularPosts.pending]: (state) => {
      state.posts.items = [];
      state.posts.status = 'loading';
    },
    [fetchPopularPosts.fulfilled]: (state, action) => {
      state.posts.items = action.payload;
      state.posts.status = 'loaded';
    },
    [fetchPopularPosts.rejected]: (state) => {
      state.posts.items = [];
      state.posts.status = 'error';
    },

  }
})

export const postReducer = postsSlice.reducer;