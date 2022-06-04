import React from 'react';
import {Autocomplete, Grid, InputAdornment, SvgIcon, TextField} from "@mui/material";
import {FiSearch as FiSearchIcon} from "react-icons/fi";
import {ICountryOption} from "../../../models/ICountry";

interface TableFilterProps {
    query: string;
    handleQueryChange: VoidFunction;
    countries: ICountryOption[];
    handleCountryChange: Function;
    country: ICountryOption;
}

const TableFilter: React.FC<TableFilterProps> = (props) => {
    const {query, handleQueryChange, countries, handleCountryChange, country} = props

    return (
        <Grid
            container
            spacing={2}
            sx={{py: 3, px: 2, justifyContent: "space-between"}}
        >
            <Grid item>
                <TextField
                    sx={{width: 300}}
                    size="small"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SvgIcon fontSize="small" color="action">
                                    <FiSearchIcon/>
                                </SvgIcon>
                            </InputAdornment>
                        )
                    }}
                    onChange={handleQueryChange}
                    placeholder="Поиск"
                    value={query}
                    variant="outlined"
                />
            </Grid>
            <Grid item>
                <Autocomplete
                    options={countries}
                    getOptionLabel={option => option.name}
                    value={country}
                    onChange={(e, value) => handleCountryChange(value)}
                    sx={{ minWidth: 250 }}
                    size="small"
                    renderInput={params => (
                        <TextField
                            label="Страны"
                            variant="outlined"
                            {...params}
                        />
                    )}
                />
            </Grid>
        </Grid>
    );
};

export default TableFilter;