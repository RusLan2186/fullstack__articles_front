import { configureStore } from "@reduxjs/toolkit";
import { postReducer } from "./slices/posts";
import { commentsReducer } from "./slices/comments";
import { authReducer } from "./slices/auth";

const store = configureStore({
  reducer: {
    posts: postReducer,
    comments: commentsReducer,
    auth: authReducer
  },
})

export default store