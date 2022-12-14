import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {IUser} from "../../models/IUser";
import {RootState} from "../index";
import authService from "../../services/AuthService";
import {IEventOption} from "../../models/IEvent";
import {ILocation} from "../../models/ILocation";

interface initialStateInterface {
    user: IUser | null;
    isAuthenticated: boolean;
}

const initialState: initialStateInterface = {
    user: null,
    isAuthenticated: false,
}

if (authService.isAuthenticated()) {
    const user = authService.getUserFromSession()
    authService.setAxiosAuthorization()

    initialState.user = user
    initialState.isAuthenticated = true
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<IUser>) => {
            state.user = action.payload
            state.isAuthenticated = true
        },
        logout: (state) => {
            authService.logout()
            state.user = null
            state.isAuthenticated = false
        },
        updateAuthEvent: (state, action: PayloadAction<IEventOption>) => {
            state.user!.event = action.payload
            authService.setUserInSession(state.user!)
        },
        deleteAuthEvent: (state) => {
            delete state.user!.event

            console.log(state.user)
            authService.setUserInSession(state.user!)
        },
        updateLocationEvent: (state, action: PayloadAction<ILocation>) => {
            state.user!.location = action.payload
            authService.setUserInSession(state.user!)
        },
        updateVerify: (state, action: PayloadAction<boolean>) => {
            state.user!.verify = action.payload
            authService.setUserInSession(state.user!)
        }
    }
})

export const {login, logout, updateAuthEvent, updateLocationEvent, updateVerify, deleteAuthEvent} = authSlice.actions

export const selectAuth = (state: RootState) => state.auth

export default authSlice.reducer