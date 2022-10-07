import React, {useEffect} from 'react';
import {styled} from "@mui/material/styles";
import Page from "../../components/Page";
import {
    Box,
    Card,
    Container,
    Grid,
    InputAdornment,
    SvgIcon,
    Table, TableBody,
    TableCell,
    TableContainer,
    TableHead, TablePagination,
    TableRow,
    TextField, Typography
} from "@mui/material";
import PerfectScrollbar from "react-perfect-scrollbar";
import {FiSearch} from "react-icons/fi";
import {useAppDispatch, useAppSelector} from "../../store/hooks";
import Header from "./Header";
import {
    changePage, changeRowsPerPage,
    fetchLoggerError,
    fetchLoggerPending,
    fetchLoggerSuccess, queryChange, reset,
    selectLoggerList
} from "../../store/reducers/loggerListSlice";
import {useSnackbar} from "notistack";
import useDebounce from "../../hooks/useDebounce";
import errorMessageHandler from "../../utils/errorMessageHandler";
import NoFoundTableBody from "../../components/NoFoundTableBody";
import loggerService from "../../services/LoggerService";

const Root = styled('div')(({theme}) => ({
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
}))

const LoggerListView = () => {
    const dispatch = useAppDispatch()
    const {
        page,
        rowsPerPage,
        query,
        loadingRow,
        rows,
        rowsCount,
        location
    } = useAppSelector(selectLoggerList)
    const {enqueueSnackbar} = useSnackbar()
    const debouncedSearchTerm = useDebounce(query, 500)

    useEffect(() => () => {dispatch(reset())}, [dispatch])

    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                dispatch(fetchLoggerPending())

               const data: any = await loggerService.getListLogger(page + 1, rowsPerPage, debouncedSearchTerm, location?.id || 0)


                if (!cancel) dispatch(fetchLoggerSuccess({rows: data.content, rowsCount: data.totalElements}))
            } catch (error: any) {
                dispatch(fetchLoggerError())
                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            }
        })()

        return () => {cancel = true}
    }, [enqueueSnackbar, page, rowsPerPage, debouncedSearchTerm, dispatch])

    return (
        <>
            <Page title="Логирование"/>
            <Root>
                <Container maxWidth="xl">
                    <Header page={page + 1} />
                    <Box mt={3}>
                        <Card>
                            <PerfectScrollbar>
                                <Box minWidth={750} sx={{mb: 2}}>
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
                                        <Grid item >
                                            <Typography variant="body1">
                                                Количество поситителей: <b>{rowsCount}</b>
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                    <TableContainer>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>№</TableCell>
                                                    <TableCell>ФИО</TableCell>
                                                    <TableCell>Места проведения</TableCell>
                                                    <TableCell>Страна</TableCell>
                                                    <TableCell>Статус</TableCell>
                                                    {/*<TableCell>Охраник ФИО</TableCell>*/}
                                                    <TableCell>Дата</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            {
                                                rows.length > 0 ? (
                                                    <TableBody>
                                                        {
                                                            rows.map((row, index) => {

                                                                return(
                                                                <TableRow hover key={index}>
                                                                    <TableCell>{row.guestNumber}</TableCell>
                                                                    <TableCell>{row.fullName}</TableCell>
                                                                    <TableCell>{row.eventLocation}</TableCell>
                                                                    <TableCell>{row.country}</TableCell>
                                                                    <TableCell>{row.status}</TableCell>
                                                                    {/*<TableCell>{row.guardName}</TableCell>*/}
                                                                    <TableCell>{row.createdDate}</TableCell>
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
        </>
    );
};

export default LoggerListView;
