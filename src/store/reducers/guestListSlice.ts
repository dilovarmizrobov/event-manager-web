import {IGuest} from "../../models/IGuest";
import {ICountryOption} from "../../models/ICountry";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../index";

interface initialStateInterface {
    page: number;
    rowsPerPage: number;
    query: string;
    selected: number[];
    loadingCountry: boolean;
    loadingRow: boolean;
    errorCountry: boolean;
    rows: IGuest[];
    rowsCount: number;
    countries: ICountryOption[];
    country: ICountryOption | null;
    barcode: string | undefined;
}

const initialState: initialStateInterface = {
    page: 0,
    rowsPerPage: 50,
    query: '',
    selected: [],
    loadingCountry: true,
    loadingRow: true,
    errorCountry: false,
    rows: [],
    rowsCount: 0,
    countries: [],
    country: null,
    barcode: undefined
}

export const guestListSlice = createSlice({
    name: 'guestList',
    initialState,
    reducers: {
        reset: (state) => {
            let keys = Object.keys(initialState) as Array<never>

            for (let i = 0; i < keys.length; i++) {
                state[keys[i]] = initialState[keys[i]]
            }
        },
        fetchCountrySuccess: (state, action: PayloadAction<ICountryOption[]>) => {
            state.countries = action.payload
            state.loadingCountry = false
            state.errorCountry = false
        },
        fetchCountryError: (state) => {
            state.loadingCountry = false
            state.errorCountry = true
        },
        fetchGuestPending: (state) => {
            state.rows = []
            state.loadingRow = true
        },
        fetchGuestSuccess: (state, action: PayloadAction<{ rows: IGuest[], rowsCount: number }>) => {
            state.rows = action.payload.rows
            state.rowsCount = action.payload.rowsCount
            state.loadingRow = false
        },
        fetchGuestError: (state) => {
            state.loadingRow = false
        },
        queryChange: (state, action: PayloadAction<string>) => {
            state.page = 0
            state.query = action.payload
        },
        barcodeChange: (state, action: PayloadAction<string>) => {
            state.barcode = action.payload
        },
        countryChange: (state, action: PayloadAction<ICountryOption | null>) => {
            state.country = action.payload
            state.page = 0
        },
        changePage: (state, action: PayloadAction<number>) => {
            state.page = action.payload
        },
        changeRowsPerPage: (state, action: PayloadAction<number>) => {
            state.rowsPerPage = action.payload
            state.page = 0
        },
        setSelectedOne: (state, action: PayloadAction<number>) => {
            const id = action.payload
            const selectedIndex = state.selected.indexOf(id);

            if (selectedIndex === -1) {
                state.selected.push(id)
            } else {
                state.selected.splice(selectedIndex, 1)
            }
        },
        setSelectedAll: (state, action: PayloadAction<boolean>) => {
            const checked = action.payload
            const rowIds = state.rows.map(item => item.id!);

            if (checked) {
                const numbers: number[] = [];

                for (let i = 0; i < rowIds.length; i++) {
                    if (state.selected.indexOf(rowIds[i]) === -1) {
                        numbers.push(rowIds[i])
                    }
                }

                state.selected = state.selected.concat(numbers)
            } else {
                state.selected = state.selected.filter(n => !rowIds.includes(n))
            }
        },
        unsetSelected: (state) => {
            state.selected = []
        },
        issueBadge: (state, action: PayloadAction<number>) => {
            let index = state.rows.findIndex(row => row.id! === action.payload)
            state.rows[index].badgeIssued = true
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
    issueBadge,
    unsetSelected,
    setSelectedOne,
    setSelectedAll,
    changeRowsPerPage,
    changePage,
    countryChange,
    barcodeChange,
    fetchGuestPending,
    fetchGuestError,
    fetchGuestSuccess,
    fetchCountrySuccess,
    fetchCountryError,
    queryChange
} = guestListSlice.actions

export const selectGuestList = (state: RootState) => state.guestList

export default guestListSlice.reducer

