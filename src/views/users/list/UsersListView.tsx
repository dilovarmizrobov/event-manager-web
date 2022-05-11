import React, {useState} from 'react';
import {styled} from "@mui/material/styles";
import Page from "../../../components/Page";
import {
    Box,
    Card,
    Container,
    Grid,
    InputAdornment,
    SvgIcon,
    Table,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Toolbar
} from "@mui/material";
import Header from "./Header";
import PerfectScrollbar from "react-perfect-scrollbar";
import {FiSearch as FiSearchIcon} from "react-icons/fi";
import {useSnackbar} from "notistack";
import useDebounce from "../../../hooks/useDebounce";

const Root = styled('div')(({theme}) => ({
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
}))

const UsersListView = () => {
    const {enqueueSnackbar} = useSnackbar()
    const [page, setPage] = useState<number>(0)
    const [size, setSize] = useState<number>(20)
    const [loading, setLoading] = useState(false)
    const [query, setQuery] = useState('')
    const debouncedSearchTerm = useDebounce(query, 500)


    return (
        <>
            <Page title="Пользователи"/>
            <Root>
                <Container maxWidth="xl">
                    <Header/>
                    <Box mt={3}>
                        <Card>
                            <PerfectScrollbar>
                                <Box minWidth={750} sx={{mb: 2}}>
                                    <Toolbar
                                        sx={{
                                            py: 3,
                                            pl: {sm: 2},
                                            pr: {xs: 1, sm: 1},
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
                                                    //onChange={handleQueryChange}
                                                    placeholder="Поиск"
                                                    value={query}
                                                    variant="outlined"
                                                />
                                            </Grid>
                                        </Grid>
                                    </Toolbar>
                                    <TableContainer>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>№</TableCell>
                                                    <TableCell>ФИО</TableCell>
                                                    <TableCell>Должность</TableCell>
                                                    <TableCell>Место</TableCell>
                                                    <TableCell>Телефон</TableCell>
                                                    <TableCell>Email</TableCell>
                                                </TableRow>
                                            </TableHead>
                                        </Table>
                                    </TableContainer>
                                </Box>
                            </PerfectScrollbar>
                        </Card>
                    </Box>
                </Container>
            </Root>
        </>
    );
};

export default UsersListView;