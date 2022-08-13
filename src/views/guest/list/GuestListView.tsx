import React, {useEffect} from 'react';
import Header from "./Header";
import {
    Autocomplete,
    Box, Button,
    Card, Checkbox,
    Container, Grid, IconButton,
    InputAdornment,
    SvgIcon, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow,
    TextField, Toolbar, Typography
} from "@mui/material";
import Page from "../../../components/Page";
import {styled} from "@mui/material/styles";
import {FiSearch, FiEdit} from "react-icons/fi";
import PerfectScrollbar from "react-perfect-scrollbar";
import { alpha } from '@mui/material/styles';
import errorMessageHandler from "../../../utils/errorMessageHandler";
import guestService from "../../../services/GuestService";
import {useSnackbar} from "notistack";
import useDebounce from "../../../hooks/useDebounce";
import {NavLink as RouterLink} from "react-router-dom";
import countryService from "../../../services/CountryService";
import LoadingLayout from "../../../components/LoadingLayout";
import NoFoundTableBody from "../../../components/NoFoundTableBody";
import PrintBadgeButton from "./PrintBadgeButton";
import ScanBadgeModal from "./ScanBadgeModal";
import DeleteButtonTable from "../../../components/DeleteButtonTable";
import hasPermission from "../../../utils/hasPermisson";
import PERMISSIONS from "../../../constants/permissions";
import {IBadgeOption} from "../../../models/IBadge";
import IssueButton from "./IssueButton";
import {useAppDispatch, useAppSelector} from "../../../store/hooks";
import {
    barcodeChange, changePage, changeRowsPerPage, countryChange, deleteRow,
    fetchCountryError,
    fetchCountrySuccess, fetchGuestError, fetchGuestPending, fetchGuestSuccess,
    queryChange, reset,
    selectGuestList, setSelectedAll, setSelectedOne, unsetSelected
} from "../../../store/reducers/guestListSlice";
import {MdCheck, MdClose} from "react-icons/md";

const Root = styled('div')(({ theme }) => ({
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
}))

const GuestListView = () => {
    const dispatch = useAppDispatch()
    const {query, countries, loadingCountry, errorCountry, rowsCount, rows, loadingRow, barcode, country, page,
        rowsPerPage, selected} = useAppSelector(selectGuestList)
    const canEdit = hasPermission(PERMISSIONS.EDIT.GUEST)
    const canDelete = hasPermission(PERMISSIONS.DELETE.GUEST)
    const canPrint = hasPermission(PERMISSIONS.PRINT_BADGE)
    const canIssue = hasPermission(PERMISSIONS.ISSUE_BADGE)
    const canSelect = hasPermission(PERMISSIONS.SELECT_GUEST)
    const {enqueueSnackbar} = useSnackbar()
    const debouncedSearchTerm = useDebounce(query, 500)

    useEffect(() => () => {dispatch(reset())}, [dispatch])

    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                const dataCountries: any = await countryService.getOptionCountries()

                if (!cancel) dispatch(fetchCountrySuccess(dataCountries))
            } catch (error: any) {
                !cancel && dispatch(fetchCountryError())
                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            }
        })()

        return () => {cancel = true}
    }, [dispatch, enqueueSnackbar])

    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                dispatch(fetchGuestPending())

                const data: any = await guestService.getListGuests(page + 1, rowsPerPage, debouncedSearchTerm, country?.id || 0)

                if (!cancel) dispatch(fetchGuestSuccess({rows: data.content, rowsCount: data.totalElements}))
            } catch (error: any) {
                dispatch(fetchGuestError())
                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            }
        })()

        return () => {cancel = true}
    }, [enqueueSnackbar, page, rowsPerPage, debouncedSearchTerm, country, dispatch])

    const getCountSelectedRow = () => {
        let count = 0;

        for (let i = 0; i < rows.length; i++) {
            if (selected.indexOf(rows[i].id!) > -1) {
                count++
            }
        }

        return count
    }

    const isSelected = (id: number) => selected.indexOf(id) !== -1;

    const countSelectedRow = getCountSelectedRow()

    return (
        <>
            <Page title="Гости" />
            {
                !loadingCountry && !errorCountry ? (
                    <Root>
                        <Container maxWidth="xl">
                            <Header/>
                            <Box mt={3}>
                                <Card>
                                    <PerfectScrollbar>
                                        <Box minWidth={750} sx={{ mb: 2 }}>
                                            {selected.length > 0 && (
                                                <Toolbar
                                                    sx={{
                                                        py: 2,
                                                        pl: { sm: 2 },
                                                        pr: { xs: 1, sm: 1 },
                                                        bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                                                    }}
                                                >
                                                    <IconButton onClick={() => dispatch(unsetSelected())}>
                                                        <MdClose size={20}/>
                                                    </IconButton>
                                                    <Typography
                                                        sx={{flex: '1 1 100%', ml: 1}}
                                                        color="inherit"
                                                        variant="subtitle1"
                                                        component="div"
                                                    >
                                                        Выбрано: {selected.length > 10 ? selected.length : selected.join(", ")}
                                                    </Typography>
                                                    {canPrint && <PrintBadgeButton guestsId={selected} page={page + 1} />}
                                                </Toolbar>
                                            )}
                                            <Grid
                                                container
                                                spacing={2}
                                                sx={{
                                                    py: 3,
                                                    px: 2,
                                                    justifyContent: "space-between"
                                                }}
                                            >
                                                <Grid item>
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
                                                                        <FiSearch/>
                                                                    </SvgIcon>
                                                                </InputAdornment>
                                                            )
                                                        }}
                                                        onChange={(event) => dispatch(queryChange(event.target.value))}
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
                                                        onChange={(e, value) => {
                                                            dispatch(countryChange(value))
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
                                                </Grid>
                                            </Grid>
                                            <TableContainer>
                                                <Table>
                                                    <TableHead>
                                                        <TableRow>
                                                            {canSelect && (
                                                                <TableCell padding="checkbox">
                                                                    <Checkbox
                                                                        color="primary"
                                                                        indeterminate={countSelectedRow > 0 && countSelectedRow < rows.length}
                                                                        checked={countSelectedRow > 0 && countSelectedRow === rows.length}
                                                                        onChange={(event) => dispatch(setSelectedAll(event.target.checked))}
                                                                    />
                                                                </TableCell>
                                                            )}
                                                            <TableCell>№</TableCell>
                                                            <TableCell>QR-code</TableCell>
                                                            <TableCell>ФИО</TableCell>
                                                            <TableCell>Паспорт</TableCell>
                                                            <TableCell>Страна</TableCell>
                                                            <TableCell>Статус</TableCell>
                                                            <TableCell align="center">Флотер</TableCell>
                                                            <TableCell>Бейджик</TableCell>
                                                            {canIssue && <TableCell>Выдано</TableCell>}
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
                                                                                {canSelect && (
                                                                                    <TableCell padding="checkbox">
                                                                                        <Checkbox color="primary" checked={isItemSelected} onClick={() => dispatch(setSelectedOne(row.id!))}/>
                                                                                    </TableCell>
                                                                                )}
                                                                                <TableCell>{row.id}</TableCell>
                                                                                <TableCell>
                                                                                    <Button onClick={() => dispatch(barcodeChange(row.barcode!))} variant="text" sx={{textTransform: "none"}}>
                                                                                        {row.barcode}
                                                                                    </Button>
                                                                                </TableCell>
                                                                                <TableCell>
                                                                                    {row.fullName}
                                                                                </TableCell>
                                                                                <TableCell>{row.passport}</TableCell>
                                                                                <TableCell sx={{maxWidth: 250}}>{row.country!.name}</TableCell>
                                                                                <TableCell>{(row.type as IBadgeOption).name}</TableCell>
                                                                                <TableCell align="center">
                                                                                    {row.hasFloater ? <MdCheck size={20} color="green"/> : <MdClose size={20} color="red"/>}
                                                                                </TableCell>
                                                                                <TableCell>{row.qty}</TableCell>
                                                                                {canIssue && (
                                                                                    <TableCell>
                                                                                        <IssueButton
                                                                                            rowId={row.id!}
                                                                                            badgeIssued={row.badgeIssued!}
                                                                                        />
                                                                                    </TableCell>
                                                                                )}
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
                                                                                                    handleDelete={(rowId: number) => dispatch(deleteRow(rowId))}
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
                                        onPageChange={(event, newPage) => dispatch(changePage(newPage))}
                                        rowsPerPage={rowsPerPage}
                                        rowsPerPageOptions={[50, 100, 500, 1000]}
                                        onRowsPerPageChange={(event) => dispatch(changeRowsPerPage(parseInt(event.target.value, 10)))}
                                        labelDisplayedRows={({from, to, count}) => `${from}-${to} из ${count}`}
                                    />
                                </Card>
                            </Box>
                        </Container>
                    </Root>
                ) : <LoadingLayout loading={loadingCountry} error={errorCountry} />
            }
            <ScanBadgeModal barcode={barcode} />
        </>
    );
};

export default GuestListView;
