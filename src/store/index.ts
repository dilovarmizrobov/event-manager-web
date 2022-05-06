import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './reducers/counterSlice'
import userReducer from './reducers/userSlice'
import authReducer from "./reducers/authSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        counter: counterReducer,
        users: userReducer,
    },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch