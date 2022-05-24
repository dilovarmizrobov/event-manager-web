import React, {useEffect, useState} from 'react';
import Page from "../../../components/Page";
import Header from "./Header";
import {
    Box, Button,
    Card,
    Container, Grid, IconButton,
    InputAdornment,
    SvgIcon, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow,
    TextField,
} from "@mui/material";
import { styled} from "@mui/material/styles";
import PerfectScrollbar from "react-perfect-scrollbar";
import {FiEdit, FiSearch as FiSearchIcon} from "react-icons/fi";
import {useSnackbar} from "notistack";
import {NavLink as RouterLink, useNavigate} from "react-router-dom";
import useDebounce from "../../../hooks/useDebounce";
import moment from "moment";
import {IEventOption, IEventResponse} from "../../../models/IEvent";
import NoFoundTableBody from "../../../components/NoFoundTableBody";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import eventService from "../../../services/EventService";
import DeleteButtonTable from "../../../components/DeleteButtonTable";
import {useAppDispatch, useAppSelector} from "../../../store/hooks";
import {deleteAuthEvent, selectAuth, updateAuthEvent} from "../../../store/reducers/authSlice";
import CompletedButton from "./CompletedButton";
import {DatePicker} from "@mui/x-date-pickers";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import ruLocale from 'date-fns/locale/ru';

const Root = styled('div')(({theme}) => ({
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
}))

const EventListView = () => {
    const {user} = useAppSelector(selectAuth)
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const {enqueueSnackbar} = useSnackbar()
    const [page, setPage] = useState<number>(0)
    const [size, setSize] = useState<number>(20)
    const [loading, setLoading] = useState(false)
    const [query, setQuery] = useState('')
    const debouncedSearchTerm = useDebounce(query, 500)
    const [startDate, setStartDate] = React.useState<string>();
    const [startDateInput, setStartDateInput] = React.useState<Date | null>(null);
    const [endDate, setEndDate] = React.useState<string>();
    const [endDateInput, setEndDateInput] = React.useState<Date | null>(null);
    const [rows, setRows] = useState<IEventResponse[]>([])
    const [rowsCount, setRowsCount] = useState<number>(0);

    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                setLoading(true)
                setRows([])

                 const data: any = await eventService.getListEvents(page + 1, size, debouncedSearchTerm, startDate, endDate)

                if (!cancel) {
                    setRows(data.content)
                    setRowsCount(data.totalElements)
                }
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

    const handleStartDateChange = (newValue: Date | null) => {
        if (newValue === null) {
            setStartDate(undefined)
            setPage(0)
        }

        if (moment(newValue).isValid()) {
            setStartDate(moment(newValue).format('YYYY-MM-DD'))
            setPage(0)
        }

        setStartDateInput(newValue)
    }

    const handleEndDateChange = (newValue: Date | null) => {
        if (newValue === null) {
            setEndDate(undefined)
            setPage(0)
        }

        if (moment(newValue).isValid()) {
            setEndDate(moment(newValue).format('YYYY-MM-DD'))
            setPage(0)
        }

        setEndDateInput(newValue)
    }

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSize(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleDeleteRow = (rowId: number) => {
        let newRows = [...rows]
        let index = newRows.findIndex(row => row.id! === rowId)
        newRows.splice(index, 1)
        setRows(newRows)
        if (user!.event?.id === rowId) dispatch(deleteAuthEvent())
    }

    const handleSelectEvent = (eventResponse: IEventResponse) => {
        const event: IEventOption = {
            id: eventResponse.id,
            name: eventResponse.name
        }

        dispatch(updateAuthEvent(event))
        navigate('/guests')
    }

    const handleComplete = (event: IEventResponse) => {
        const index = rows.findIndex(item => item.id === event.id)
        const newRows = [...rows]
        newRows[index] = event
        setRows(newRows)
    }

    return (
        <>
            <Page title="Мероприятия"/>
            <Root>
                <Container maxWidth="xl">
                    <Header/>
                    <Box mt={3}>
                        <Card>
                            <PerfectScrollbar>
                                <Box minWidth={750} sx={{mb:2}}>
                                    <Box py={3} px={2}>
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
                                                <LocalizationProvider dateAdapter={AdapterDateFns} locale={ruLocale}>
                                                    <DatePicker
                                                        label="От"
                                                        mask={'__.__.____'}
                                                        value={startDateInput}
                                                        onChange={handleStartDateChange}
                                                        renderInput={(params) => <TextField size="small" {...params} />}
                                                    />
                                                </LocalizationProvider>
                                            </Grid>
                                            <Grid item>
                                                <LocalizationProvider dateAdapter={AdapterDateFns} locale={ruLocale}>
                                                    <DatePicker
                                                        label="До"
                                                        mask={'__.__.____'}
                                                        value={endDateInput}
                                                        onChange={handleEndDateChange}
                                                        renderInput={(params) => <TextField size="small" {...params} />}
                                                    />
                                                </LocalizationProvider>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                    <TableContainer>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>№</TableCell>
                                                    <TableCell>Мероприятие</TableCell>
                                                    <TableCell>Период</TableCell>
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
                                                                    <TableCell>
                                                                        <Button
                                                                            onClick={() => handleSelectEvent(row)}
                                                                            variant="text"
                                                                        >
                                                                            {row.name}
                                                                        </Button>
                                                                    </TableCell>
                                                                    <TableCell>{row.fromDate} - {row.toDate}</TableCell>
                                                                    <TableCell>
                                                                        {
                                                                            row.active ? (
                                                                                <span style={{color: "#60D982"}}>Активный</span>
                                                                            ) : (
                                                                                <span style={{color: "#686868"}}>Завершенный</span>
                                                                            )
                                                                        }
                                                                    </TableCell>
                                                                    <TableCell>{row.registered}</TableCell>
                                                                    <TableCell>{row.attended}</TableCell>
                                                                    <TableCell style={{ width: 165 }}>
                                                                        <CompletedButton
                                                                            rowId={row.id}
                                                                            completed={!row.active}
                                                                            handleComplete={handleComplete}
                                                                        />
                                                                        <IconButton
                                                                            size="large"
                                                                            component={RouterLink}
                                                                            to={`/events/${row.id}/edit`}
                                                                            disabled={!row.active}
                                                                        >
                                                                            <FiEdit size={20} />
                                                                        </IconButton>
                                                                        <DeleteButtonTable
                                                                            rowId={row.id}
                                                                            onDelete={eventService.deleteEvent}
                                                                            handleDelete={handleDeleteRow}
                                                                            disabled={!row.active}
                                                                        />
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))
                                                        }
                                                    </TableBody>
                                                ) :<NoFoundTableBody loading={loading}/>
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