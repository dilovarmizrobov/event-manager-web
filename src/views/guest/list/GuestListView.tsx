import React, {useEffect, useReducer, useState} from 'react';
import Header from "./Header";
import {
    Autocomplete,
    Box,
    Card, Checkbox,
    Container, IconButton,
    InputAdornment,
    SvgIcon, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow,
    TextField, Toolbar, Typography
} from "@mui/material";
import Page from "../../../components/Page";
import {styled} from "@mui/material/styles";
import {FiSearch as FiSearchIcon, FiEdit} from "react-icons/fi";
import PerfectScrollbar from "react-perfect-scrollbar";
import { alpha } from '@mui/material/styles';
import {IGuest} from "../../../models/IGuest";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import guestService from "../../../services/GuestService";
import {useSnackbar} from "notistack";
import useDebounce from "../../../hooks/useDebounce";
import {NavLink as RouterLink, useNavigate} from "react-router-dom";
import {ICountryOption} from "../../../models/ICountry";
import countryService from "../../../services/CountryService";
import LoadingLayout from "../../../components/LoadingLayout";
import NoFoundTableBody from "../../../components/NoFoundTableBody";
import PrintBadgeButton from "./PrintBadgeButton";
import ScanBadgeModal from "./ScanBadgeModal";
import DeleteButtonTable from "../../../components/DeleteButtonTable";
import hasPermission from "../../../utils/hasPermisson";
import PERMISSIONS from "../../../constants/permissions";
import {IBadgeOption} from "../../../models/IBadge";

const Root = styled('div')(({ theme }) => ({
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
}))

const GuestListView = () => {
    const canEdit = hasPermission(PERMISSIONS.EDIT.GUEST)
    const canDelete = hasPermission(PERMISSIONS.DELETE.GUEST)
    const canPrint = hasPermission(PERMISSIONS.PRINT.GUEST)
    const {enqueueSnackbar} = useSnackbar()
    const navigate = useNavigate()
    const [updateRows, setUpdateRows] = useReducer(x => x + 1, 0);
    const [page, setPage] = useState<number>(0)
    const [size, setSize] = useState<number>(30)
    const [query, setQuery] = useState('')
    const debouncedSearchTerm = useDebounce(query, 500)
    const [selected, setSelected] = useState<number[]>([])
    const [loading, setLoading] = useState(true)
    const [loadingRow, setLoadingRow] = useState(true)
    const [error, setError] = useState(false)
    const [rows, setRows] = useState<IGuest[]>([])
    const [rowsCount, setRowsCount] = useState<number>(0);
    const [countries, setCountries] = useState<ICountryOption[]>([])
    const [country, setCountry] = useState<ICountryOption | null>(null)

    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                const dataCountries: any = await countryService.getOptionCountries()
                
                if (!cancel) setCountries(dataCountries)
            } catch (error: any) {
                !cancel && setError(true)
                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            } finally {
                !cancel && setLoading(false)
            }
        })()

        return () => {cancel = true}
    }, [enqueueSnackbar])

    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                setLoadingRow(true)
                setRows([])

                const data: any = await guestService.getListGuests(page + 1, size, debouncedSearchTerm, country?.id || 0)

                if (!cancel) {
                    setRows(data.content)
                    setRowsCount(data.totalElements)
                }
            } catch (error: any) {
                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            } finally {
                !cancel && setLoadingRow(false)
            }
        })()

        return () => {cancel = true}
    }, [enqueueSnackbar, page, size, debouncedSearchTerm, country, navigate, updateRows])

    const handleQueryChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setQuery(event.target.value);
        setPage(0);
        setSelected([]);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
        setSelected([]);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSize(parseInt(event.target.value, 10));
        setPage(0);
        setSelected([]);
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
        let newSelected: number[] = [];

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

    const handleDeleteRow = (rowId: number) => {
        let newRows = [...rows]
        let index = newRows.findIndex(row => row.id! === rowId)
        newRows.splice(index, 1)
        setRows(newRows)
    }

    const isSelected = (id: number) => selected.indexOf(id) !== -1;

    return (
        <>
            <Page title="Гости" />
            {
                !loading && !error ? (
                    <Root>
                        <Container maxWidth="xl">
                            <Header setUpdateRows={setUpdateRows} />
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
                                                            {canPrint && <PrintBadgeButton guestsId={selected} page={page + 1} />}
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Box sx={{ flex: '1 1 100%'}}>
                                                                <TextField
                                                                    sx={{width: 300}}
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
                                                                <Autocomplete
                                                                    options={countries}
                                                                    getOptionLabel={option => option.name}
                                                                    value={country}
                                                                    onChange={(e, value) => {
                                                                        setCountry(value)
                                                                        setPage(0);
                                                                        setSelected([]);
                                                                    }}
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
                                                            <TableCell>QR-code</TableCell>
                                                            <TableCell>ФИО</TableCell>
                                                            <TableCell>Паспорт</TableCell>
                                                            <TableCell>Страна</TableCell>
                                                            <TableCell>Email</TableCell>
                                                            <TableCell>Статус</TableCell>
                                                            <TableCell>Бейджик</TableCell>
                                                            {/*<TableCell>Выдано</TableCell>*/}
                                                            {(canEdit || canDelete || canPrint) && <TableCell/>}
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
                                                                                <TableCell>{row.id}</TableCell>
                                                                                <TableCell>{row.barcode}</TableCell>
                                                                                <TableCell component="th" scope="row" padding="none">
                                                                                    {row.fullName}
                                                                                </TableCell>
                                                                                <TableCell>{row.passport}</TableCell>
                                                                                <TableCell>{row.country!.name}</TableCell>
                                                                                <TableCell>{row.email}</TableCell>
                                                                                <TableCell>{(row.type as IBadgeOption).name}</TableCell>
                                                                                <TableCell>{row.qty}</TableCell>
                                                                                {
                                                                                    (canEdit || canDelete || canPrint) && (
                                                                                        <TableCell style={{ width: 165 }}>

                                                                                            {canPrint && <PrintBadgeButton guestsId={[row.id!]} page={page + 1} />}
                                                                                            {canEdit && (
                                                                                                <IconButton
                                                                                                    size="large"
                                                                                                    component={RouterLink}
                                                                                                    to={`/guests/${row.id}/edit`}
                                                                                                >
                                                                                                    <FiEdit size={20} />
                                                                                                </IconButton>
                                                                                            )}
                                                                                            {canDelete && (
                                                                                                <DeleteButtonTable
                                                                                                    rowId={row.id!}
                                                                                                    onDelete={guestService.deleteGuest}
                                                                                                    handleDelete={handleDeleteRow}
                                                                                                />
                                                                                            )}
                                                                                        </TableCell>
                                                                                    )
                                                                                }
                                                                            </TableRow>
                                                                        )
                                                                    })
                                                                }
                                                            </TableBody>
                                                        ) : <NoFoundTableBody loading={loadingRow}/>
                                                    }
                                                </Table>
                                            </TableContainer>
                                        </Box>
                                    </PerfectScrollbar>
                                    <TablePagination
                                        component="div"
                                        count={rowsCount}
                                        labelRowsPerPage={'Строк на странице:'}
                                        page={page}
                                        onPageChange={handleChangePage}
                                        rowsPerPage={size}
                                        rowsPerPageOptions={[50, 100, 500, 1000]}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                        labelDisplayedRows={({from, to, count}) => `${from}-${to} из ${count}`}
                                    />
                                </Card>
                            </Box>
                        </Container>
                    </Root>
                ) : <LoadingLayout loading={loading} error={error} />
            }
            <ScanBadgeModal />
        </>
    );
};

export default GuestListView;