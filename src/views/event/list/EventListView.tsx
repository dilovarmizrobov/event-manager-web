import React, {useEffect, useState} from 'react';
import Page from "../../../components/Page";
import Header from "./Header";
import {
    Box,
    Card,
    Container, Grid, IconButton,
    InputAdornment,
    SvgIcon, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow,
    TextField,
    Toolbar
} from "@mui/material";
import { styled} from "@mui/material/styles";
import PerfectScrollbar from "react-perfect-scrollbar";
import {FiEdit, FiSearch as FiSearchIcon, FiTrash} from "react-icons/fi";
import {useSnackbar} from "notistack";
import {NavLink as RouterLink} from "react-router-dom";
import useDebounce from "../../../hooks/useDebounce";
import moment from "moment";
import {IEventResponse} from "../../../models/IEvent";
import NoFoundTableBody from "../../../components/NoFoundTableBody";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import eventService from "../../../services/EventService";

const Root = styled('div')(({theme}) => ({
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
}))


const EventListView = () => {
    const {enqueueSnackbar} = useSnackbar()
    const [page, setPage] = useState<number>(0)
    const [size, setSize] = useState<number>(20)
    const [loading, setLoading] = useState(false)
    const [query, setQuery] = useState('')
    const debouncedSearchTerm = useDebounce(query, 500)
    const [startDate, setStartDate] = useState(moment().subtract(30, 'days').format('YYYY-MM-DD'))
    const [endDate, setEndDate] = useState(moment().format('YYYY-MM-DD'))
    const [rows, setRows] = useState<IEventResponse[]>([])

    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                setLoading(true)
                setRows([])

                 const data: any = await eventService.getListEvents(page + 1, size, debouncedSearchTerm, startDate, endDate)

                if (!cancel) setRows(data.content)
            } catch (error: any) {
                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            } finally {
                !cancel && setLoading(false)
            }
        })()

        return () => {cancel = true}
    },[enqueueSnackbar, page, size, startDate, endDate, debouncedSearchTerm])

    const handleQueryChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        event.persist()
        setQuery(event.target.value)
        setPage(0);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage+1);
    };

    const handleStartDateChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        event.persist()
        setStartDate(event.target.value)
        setPage(0)
    }

    const handleEndDateChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        event.persist()
        setEndDate(event.target.value)
        setPage(0)
    }

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSize(parseInt(event.target.value, 10));
        setPage(0);
    };


    const emptyRows = page > 0 ? Math.max(0, (1 + page) * size - rows.length) : 0;


    return (
        <>
            <Page title="Места проведения"/>
            <Root>
                <Container maxWidth="xl">
                    <Header/>
                    <Box mt={3}>
                        <Card>
                            <PerfectScrollbar>
                                <Box minWidth={750} sx={{mb:2}}>
                                    <Toolbar
                                        sx={{
                                            py: 3,
                                            pl: { sm: 2 },
                                            pr: { xs: 1, sm: 1 },
                                            // ...(selected.length > 0 && {
                                            //     bgcolor: (theme) =>
                                            //         alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                                            // }),
                                        }}
                                    >
                                        <Grid container spacing={4}>
                                            <Grid item>
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
                                            </Grid>
                                            <Grid item>
                                                <TextField
                                                    fullWidth
                                                    type="date"
                                                    label="От"
                                                    onChange={handleStartDateChange}
                                                    value={startDate}
                                                    variant="outlined"
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    size="small"
                                                />
                                            </Grid>
                                            <Grid item>
                                                <TextField
                                                    fullWidth
                                                    type="date"
                                                    label="До"
                                                    onChange={handleEndDateChange}
                                                    value={endDate}
                                                    variant="outlined"
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    size="small"
                                                />
                                            </Grid>
                                        </Grid>

                                    </Toolbar>
                                    <TableContainer>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>№</TableCell>
                                                    <TableCell>Период</TableCell>
                                                    <TableCell>Мероприятие</TableCell>
                                                    <TableCell>Статус</TableCell>
                                                    <TableCell>Зарегистрированно</TableCell>
                                                    <TableCell>Участвовали</TableCell>
                                                    <TableCell/>
                                                </TableRow>
                                            </TableHead>
                                            {
                                                rows.length > 0 ? (
                                                    <TableBody>
                                                        {
                                                            rows.map((row, index) => (
                                                                <TableRow hover key={row.id}>
                                                                    <TableCell>{index + 1}</TableCell>
                                                                    <TableCell>{row.fromDate} - {row.toDate}</TableCell>
                                                                    <TableCell>{row.name}</TableCell>
                                                                    <TableCell>{row.active ? "true" : "false"}</TableCell>
                                                                    <TableCell>1234</TableCell>
                                                                    <TableCell>123</TableCell>
                                                                    <TableCell style={{ width: 165 }}>
                                                                        <IconButton
                                                                            size="large"
                                                                            component={RouterLink}
                                                                            to={`/events/${row.id}/edit`}
                                                                        >
                                                                            <FiEdit size={20} />
                                                                        </IconButton>
                                                                        <IconButton size="large">
                                                                            <FiTrash size={20} />
                                                                        </IconButton>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))
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
                                                ) :<NoFoundTableBody loading={loading}/>
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

        </>
    );
};

export default EventListView;