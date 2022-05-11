import React, {useEffect, useState} from 'react';
import Header from "./Header";
import {
    Box,
    Card, Checkbox,
    Container, FormControl, IconButton,
    InputAdornment, InputLabel, MenuItem, Select, SelectChangeEvent,
    SvgIcon, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow,
    TextField, Toolbar, Tooltip, Typography
} from "@mui/material";
import Page from "../../../components/Page";
import {styled} from "@mui/material/styles";
import {FiSearch as FiSearchIcon, FiPrinter, FiEdit, FiTrash} from "react-icons/fi";
import PerfectScrollbar from "react-perfect-scrollbar";
import { alpha } from '@mui/material/styles';
import {IGuest} from "../../../models/IGuest";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import guestService from "../../../services/GuestService";
import {useSnackbar} from "notistack";
import useDebounce from "../../../hooks/useDebounce";
import {GuestTypeMap} from "../../../constants";
import {NavLink as RouterLink, useNavigate} from "react-router-dom";
import {ICountryResponse} from "../../../models/ICountry";
import countryService from "../../../services/CountryService";
import LoadingLayout from "../../../components/LoadingLayout";
import NoFoundTableBody from "../../../components/NoFoundTableBody";

const Root = styled('div')(({ theme }) => ({
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
}))

const GuestListView = () => {
    const {enqueueSnackbar} = useSnackbar()
    const navigate = useNavigate()
    const [page, setPage] = useState<number>(0)
    const [size, setSize] = useState<number>(20)
    const [query, setQuery] = useState('')
    const debouncedSearchTerm = useDebounce(query, 500)
    const [countryId, setCountryId] = useState<number>(0)
    const [selected, setSelected] = useState<readonly number[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [rows, setRows] = useState<IGuest[]>([])
    const [countries, setCountries] = useState<ICountryResponse[]>([])

    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                setLoading(true)
                setRows([])

                const data: any = await guestService.getListGuests(page, size, debouncedSearchTerm, countryId)

                if (countries.length === 0) {
                    const dataCountries: any = await countryService.getCountries()

                    if (!cancel) {
                        if (dataCountries.length === 0) {
                            navigate(-1)
                            enqueueSnackbar('Добавьте с начала страны', {variant: 'info'})
                        } else {
                            setCountries(dataCountries)
                        }
                    }
                }

                if (!cancel) setRows(data.content)
            } catch (error: any) {
                !cancel && setError(true)
                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            } finally {
                !cancel && setLoading(false)
            }
        })()

        return () => {cancel = true}
    }, [enqueueSnackbar, page, size, debouncedSearchTerm, countryId, navigate, countries.length])

    const handleQueryChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setQuery(event.target.value);
        setPage(0);
    };

    const handleChangeCountry = (event: SelectChangeEvent<string | number>) => {
        setCountryId(Number(event.target.value));
        setPage(0);
    }

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSize(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelecteds = rows.map((n) => n.id!);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected: readonly number[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };

    const isSelected = (id: number) => selected.indexOf(id) !== -1;

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * size - rows.length) : 0;

    return (
        <>
            <Page title="Гости" />
            {
                countries.length > 0 ? (
                    <Root>
                        <Container maxWidth="xl">
                            <Header />
                            <Box mt={3}>
                                <Card>
                                    <PerfectScrollbar>
                                        <Box minWidth={750} sx={{ mb: 2 }}>
                                            <Toolbar
                                                sx={{
                                                    py: 3,
                                                    pl: { sm: 2 },
                                                    pr: { xs: 1, sm: 1 },
                                                    ...(selected.length > 0 && {
                                                        bgcolor: (theme) =>
                                                            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                                                    }),
                                                }}
                                            >
                                                {
                                                    selected.length > 0 ? (
                                                        <>
                                                            <Typography
                                                                sx={{ flex: '1 1 100%' }}
                                                                color="inherit"
                                                                variant="subtitle1"
                                                                component="div"
                                                            >
                                                                {selected.length} выбрано
                                                            </Typography>
                                                            <Tooltip title="Печать">
                                                                <IconButton>
                                                                    <FiPrinter />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Box sx={{ flex: '1 1 100%'}}>
                                                                <TextField
                                                                    sx={{width: 400}}
                                                                    size="small"
                                                                    InputProps={{
                                                                        startAdornment: (
                                                                            <InputAdornment position="start">
                                                                                <SvgIcon
                                                                                    fontSize="small"
                                                                                    color="action"
                                                                                >
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
                                                            </Box>
                                                            <Box sx={{mr: 2}}>
                                                                <FormControl sx={{ minWidth: 120 }} size="small">
                                                                    <InputLabel id="country-select-label">Страна</InputLabel>
                                                                    <Select
                                                                        labelId="country-select-label"
                                                                        id="country-select"
                                                                        value={countryId || ''}
                                                                        label="Страна"
                                                                        onChange={handleChangeCountry}
                                                                    >
                                                                        {countries.map((item, index) => (
                                                                            <MenuItem key={index} value={item.id}>{item.name}</MenuItem>
                                                                        ))}
                                                                    </Select>
                                                                </FormControl>
                                                            </Box>
                                                        </>
                                                    )
                                                }
                                            </Toolbar>
                                            <TableContainer>
                                                <Table>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell padding="checkbox">
                                                                <Checkbox
                                                                    color="primary"
                                                                    indeterminate={selected.length > 0 && selected.length < rows.length}
                                                                    checked={rows.length > 0 && selected.length === rows.length}
                                                                    onChange={handleSelectAllClick}
                                                                />
                                                            </TableCell>
                                                            <TableCell>№</TableCell>
                                                            <TableCell>ФИО</TableCell>
                                                            <TableCell>Паспорт</TableCell>
                                                            <TableCell>Страна</TableCell>
                                                            <TableCell>Email</TableCell>
                                                            <TableCell>Статус</TableCell>
                                                            <TableCell>Бейджик</TableCell>
                                                            <TableCell/>
                                                        </TableRow>
                                                    </TableHead>
                                                    {
                                                        rows.length > 0 ? (
                                                            <TableBody>
                                                                {
                                                                    rows.map((row, index) => {
                                                                        const isItemSelected = isSelected(row.id!)

                                                                        return (
                                                                            <TableRow hover key={index} selected={isItemSelected}>
                                                                                <TableCell padding="checkbox">
                                                                                    <Checkbox color="primary" checked={isItemSelected} onClick={(event) => handleClick(event, row.id!)}/>
                                                                                </TableCell>
                                                                                <TableCell>{index + 1}</TableCell>
                                                                                <TableCell component="th" scope="row" padding="none">
                                                                                    {row.fullName}
                                                                                </TableCell>
                                                                                <TableCell>{row.passport}</TableCell>
                                                                                <TableCell>{row.country!.name}</TableCell>
                                                                                <TableCell>{row.email}</TableCell>
                                                                                <TableCell>{GuestTypeMap.get(row.type)}</TableCell>
                                                                                <TableCell>Бейджик</TableCell>
                                                                                <TableCell style={{ width: 165 }}>
                                                                                    <IconButton size="large">
                                                                                        <FiPrinter size={20}/>
                                                                                    </IconButton>
                                                                                    <IconButton
                                                                                        size="large"
                                                                                        component={RouterLink}
                                                                                        to={`/guests/${row.id}/edit`}
                                                                                    >
                                                                                        <FiEdit size={20} />
                                                                                    </IconButton>
                                                                                    <IconButton size="large">
                                                                                        <FiTrash size={20} />
                                                                                    </IconButton>
                                                                                </TableCell>
                                                                            </TableRow>
                                                                        )
                                                                    })
                                                                }
                                                                {emptyRows > 0 && (
                                                                    <TableRow
                                                                        style={{
                                                                            height: 53 * emptyRows,
                                                                        }}
                                                                    >
                                                                        <TableCell colSpan={6} />
                                                                    </TableRow>
                                                                )}
                                                            </TableBody>
                                                        ) : <NoFoundTableBody loading={loading}/>
                                                    }
                                                </Table>
                                            </TableContainer>
                                        </Box>
                                    </PerfectScrollbar>
                                    <TablePagination
                                        component="div"
                                        count={rows.length}
                                        labelRowsPerPage={'Строк на странице:'}
                                        page={page}
                                        onPageChange={handleChangePage}
                                        rowsPerPage={size}
                                        rowsPerPageOptions={[20, 30, 50]}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                        labelDisplayedRows={({from, to, count}) => `${from}-${to} из ${count}`}
                                    />
                                </Card>
                            </Box>
                        </Container>
                    </Root>
                ) : <LoadingLayout loading={loading} error={error} />
            }
        </>
    );
};

export default GuestListView;