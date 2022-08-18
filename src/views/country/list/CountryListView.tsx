import React, {useEffect, useState} from 'react';
import {useSnackbar} from "notistack";
import useDebounce from "../../../hooks/useDebounce";
import {ICountryResponse} from "../../../models/ICountry";
import {styled} from "@mui/material/styles";
import Page from "../../../components/Page";
import {
    Box,
    Card,
    Container,
    IconButton,
    InputAdornment,
    SvgIcon,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
} from "@mui/material";
import Header from "./Header";
import PerfectScrollbar from "react-perfect-scrollbar";
import {FiEdit, FiSearch as FiSearchIcon} from "react-icons/fi";
import NoFoundTableBody from "../../../components/NoFoundTableBody";
import {NavLink as RouterLink} from "react-router-dom";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import countryService from "../../../services/CountryService";
import DeleteButtonTable from "../../../components/DeleteButtonTable";
import {pathCountryImage} from "../../../utils/pathImages";

const Root = styled('div')(({theme}) => ({
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
}))

const CountryListView = () => {
    const {enqueueSnackbar} = useSnackbar()
    const [page, setPage] = useState<number>(0)
    const [size, setSize] = useState<number>(20)
    const [loading, setLoading] = useState(false)
    const [query, setQuery] = useState('')
    const debouncedSearchTerm = useDebounce(query, 500)
    const [rows, setRows] = useState<ICountryResponse[]>([])
    const [rowsCount, setRowsCount] = useState<number>(0)

    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                setLoading(true)
                setRows([])

                const data: any = await countryService.getListCountry(page + 1, size, debouncedSearchTerm)

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

        return () => {
            cancel = true
        }
    }, [enqueueSnackbar, size, page, debouncedSearchTerm])

    const handleQueryChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        event.persist()
        setQuery(event.target.value)
        setPage(0);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage + 1);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSize(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleDeleteRow = (rowId: number) => {
        let newRows = [...rows]
        let index = newRows.findIndex(row => row.id! === rowId)
        newRows.splice(index, 1)
        setRows(newRows)
    }

    return (
        <>
            <Page title="Страны"/>
            <Root>
                <Container maxWidth="xl">
                    <Header/>
                    <Box mt={3}>
                        <Card>
                            <PerfectScrollbar>
                                <Box minWidth={750} sx={{mb: 2}}>
                                    <Box mx={2} my={3}>
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
                                    <TableContainer>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Название</TableCell>
                                                    <TableCell>Аббревиатура</TableCell>
                                                    <TableCell>Флаг</TableCell>
                                                    <TableCell/>
                                                </TableRow>
                                            </TableHead>
                                            {
                                                rows.length > 0 ? (
                                                    <TableBody>
                                                        {
                                                            rows.map(row => (
                                                                <TableRow hover key={row.id}>
                                                                    <TableCell>{row.name}</TableCell>
                                                                    <TableCell>{row.abbr}</TableCell>
                                                                    <TableCell>
                                                                        <img
                                                                            src={pathCountryImage(row.flag)}
                                                                            alt="..."
                                                                            width="45px"
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell style={{width: 120}}>
                                                                        <IconButton
                                                                            size="large"
                                                                            component={RouterLink}
                                                                            to={`/countries/${row.id}/edit`}
                                                                        >
                                                                            <FiEdit size={20}/>
                                                                        </IconButton>
                                                                        <DeleteButtonTable
                                                                            rowId={row.id}
                                                                            onDelete={countryService.deleteCountry}
                                                                            handleDelete={handleDeleteRow}
                                                                        />
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))
                                                        }
                                                    </TableBody>
                                                ) : <NoFoundTableBody loading={loading}/>
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

export default CountryListView;
