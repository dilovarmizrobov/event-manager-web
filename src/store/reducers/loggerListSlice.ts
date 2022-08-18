import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../index";
import {ILoggerResponse} from "../../models/ILogger";
import {ILocation} from "../../models/ILocation";

interface initialStateInterface {
    page: number;
    rowsPerPage: number;
    query: string;
    loadingRow: boolean;
    error: boolean;
    rows: ILoggerResponse[];
    rowsCount: number;
    location: ILocation | null;
}

const initialState: initialStateInterface = {
    page: 0,
    rowsPerPage: 50,
    query: '',
    loadingRow: true,
    error: false,
    rows: [],
    rowsCount: 0,
    location: null
}

export const loggerListSlice = createSlice({
    name: 'guestList',
    initialState,
    reducers: {
        reset: (state) => {
            let keys = Object.keys(initialState) as Array<never>

            for (let i = 0; i < keys.length; i++) {
                state[keys[i]] = initialState[keys[i]]
            }
        },

        fetchLoggerPending: (state) => {
            state.rows = []
            state.loadingRow = true
        },
        fetchLoggerSuccess: (state, action: PayloadAction<{ rows: ILoggerResponse[], rowsCount: number }>) => {
            state.rows = action.payload.rows
            state.rowsCount = action.payload.rowsCount
            state.loadingRow = false
        },
        fetchLoggerError: (state) => {
            state.loadingRow = false
        },
        queryChange: (state, action: PayloadAction<string>) => {
            state.page = 0
            state.query = action.payload
        },

        changePage: (state, action: PayloadAction<number>) => {
            state.page = action.payload
        },
        changeRowsPerPage: (state, action: PayloadAction<number>) => {
            state.rowsPerPage = action.payload
            state.page = 0
        },

        locationChange: (state, action: PayloadAction<ILocation | null>) => {
            state.location = action.payload
            state.page = 0
        },

        deleteRow: (state, action: PayloadAction<number>) => {
            let index = state.rows.findIndex(row => row.id! === action.payload)
            state.rows.splice(index, 1)
        },
    }
})

export const {
    reset,
    deleteRow,
    changeRowsPerPage,
    changePage,
    fetchLoggerPending,
    fetchLoggerSuccess,
    fetchLoggerError,
    locationChange,
    queryChange
} = loggerListSlice.actions

export const selectLoggerList = (state: RootState) => state.loggertList

export default loggerListSlice.reducer

