import {IUser} from "../../models/IUser";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AppDispatch, RootState} from "../index";
import axios from "axios";

interface UserState {
    users: IUser[];
    isLoading: boolean;
    error: string;
}

const initialState: UserState = {
    users: [],
    isLoading: false,
    error: ''
}

export const fetchUser = createAsyncThunk(
    'users/fetchAll',
    // Declare the type your function argument here:
    async (_, thunkApi) => {
        try {
            const response = await axios.get<IUser[]>(`https://jsonplaceholder.typicode.com/users`)
            return response.data
        } catch (e) {
            return thunkApi.rejectWithValue("Не удалось загрузить пользователей")
        }
    }
)

export const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        usersFetching: (state) => {
            state.isLoading = true
        },
        usersFetchingSuccess: (state, action: PayloadAction<IUser[]>) => {
            state.isLoading = false
            state.error = ''
            state.users = action.payload
        },
        usersFetchingError: (state, action: PayloadAction<string>) => {
            state.isLoading = false
            state.error = action.payload
        },
    },
    extraReducers: {
        [fetchUser.fulfilled.type]: (state, action: PayloadAction<IUser[]>) => {
            state.isLoading = false
            state.error = ''
            state.users = action.payload
        },
        [fetchUser.pending.type]: (state) => {
            state.isLoading = true
        },
        [fetchUser.rejected.type]: (state, action: PayloadAction<string>) => {
            state.isLoading = false
            state.error = action.payload
        }
    }
})

export const {usersFetching, usersFetchingSuccess, usersFetchingError} = userSlice.actions;

// export const fetchUser = () => async (dispatch: AppDispatch) => {
//     try {
//         dispatch(usersFetching())
//
//         const response = await axios.get<IUser[]>('https://jsonplaceholder.typicode.com/users')
//
//         dispatch(usersFetchingSuccess(response.data))
//     } catch (e: any) {
//         dispatch(usersFetchingError(e.message))
//     }
// }

export const selectUsers = (state: RootState) => state.users

export default userSlice.reducer;