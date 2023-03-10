import { configureStore } from "@reduxjs/toolkit";
import { authModalSlice } from "./authModalSlice";
import { communitiesSlice } from "./communitiesSlice";
import { postsSlice } from "./postsSlice";
import { communityDirectorySlice } from "./communityDirectorySlice";

export const store = configureStore({
  reducer: {
    authModal: authModalSlice.reducer,
    communities: communitiesSlice.reducer,
    posts: postsSlice.reducer,
    communityDirectory: communityDirectorySlice.reducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
