import { configureStore } from '@reduxjs/toolkit'
import authReducer from "./reducers/authSlice";
import guestListReducer from "./reducers/guestListSlice";
import loggerListReducer from "./reducers/loggerListSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        guestList: guestListReducer,
        loggertList: loggerListReducer,
    },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
