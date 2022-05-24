import React, {useEffect, useState} from 'react';
import {styled} from "@mui/material/styles";
import {useSnackbar} from "notistack";
import Page from "../../../components/Page";
import {
    Box,
    Card,
    Container,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";
import Header from "./Header";
import PerfectScrollbar from "react-perfect-scrollbar";
import {IBadgeResponse} from "../../../models/IBadge";
import NoFoundTableBody from "../../../components/NoFoundTableBody";
import badgeService from "../../../services/BadgeService";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import {FiEdit} from "react-icons/fi";
import {NavLink as RouterLink} from "react-router-dom";
import DeleteButtonTable from "../../../components/DeleteButtonTable";

const Root = styled('div')(({theme}) => ({
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
}))

const BadgeListView = () => {
    const {enqueueSnackbar} = useSnackbar()
    const [loading, setLoading] = useState(false)
    const [rows, setRows] = useState<IBadgeResponse[]>([])

    useEffect(() => {
        let cancel = false;

        (async() => {
            try {
                setLoading(true)
                setRows([])
                const data : any = await badgeService.getBadges()

                if(!cancel) setRows(data)
            }catch (error:any) {
                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            }finally {
                !cancel && setLoading(false)
            }
        })()
    }, [enqueueSnackbar])

    const handleDeleteRow = (rowId: number) => {
        let newRows = [...rows]
        let index = newRows.findIndex(row => row.id! === rowId)
        newRows.splice(index, 1)
        setRows(newRows)
    }

    return (
        <>
            <Page title="Шаблоны бейджов"/>
            <Root>
                <Container maxWidth="xl">
                    <Header />
                    <Box mt={3}>
                        <Card>
                            <PerfectScrollbar>
                                <Box minWidth={750} sx={{mb: 2}}>
                                    <TableContainer>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>№</TableCell>
                                                    <TableCell>Название</TableCell>
                                                    <TableCell />
                                                </TableRow>
                                            </TableHead>
                                            {
                                                rows.length > 0 ? (
                                                    <TableBody>
                                                        {
                                                            rows.map((row, index) => (
                                                                <TableRow hover key={row.id}>
                                                                    <TableCell>{index + 1}</TableCell>
                                                                    <TableCell>{row.name}</TableCell>
                                                                    <TableCell style={{ width: 140 }}>
                                                                        <IconButton
                                                                            size="large"
                                                                            component={RouterLink}
                                                                            to={`/badge-templates/${row.id}/edit`}
                                                                        >
                                                                            <FiEdit size={20} />
                                                                        </IconButton>
                                                                            <DeleteButtonTable
                                                                                rowId={row.id}
                                                                                onDelete={badgeService.deleteBadge}
                                                                                handleDelete={handleDeleteRow}
                                                                            />
                                                                    </TableCell>

                                                                </TableRow>
                                                            ))
                                                        }
                                                    </TableBody>
                                                    )
                                                : <NoFoundTableBody loading={loading} />
                                            }
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

export default BadgeListView;