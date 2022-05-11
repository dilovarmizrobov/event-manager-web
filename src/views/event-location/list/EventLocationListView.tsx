import React, {useEffect, useState} from 'react';
import Page from "../../../components/Page";
import {styled} from "@mui/material/styles";
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
import {useSnackbar} from "notistack";
import {ILocation} from "../../../models/ILocation";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import eventLocationService from "../../../services/EventLocationService";
import NoFoundTableBody from "../../../components/NoFoundTableBody";
import {FiEdit} from "react-icons/fi";
import {NavLink as RouterLink} from "react-router-dom";
import DeleteButtonTable from "../../../components/DeleteButtonTable";

const Root = styled('div')(({theme}) => ({
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
}))

const EventLocationListView = () => {
    const {enqueueSnackbar} = useSnackbar()
    const [loading, setLoading] = useState(false)
    const [rows, setRows] = useState<ILocation[]>([])

    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                setLoading(true)
                setRows([])

                const data: any = await eventLocationService.getLocations()

                if (!cancel) setRows(data)
            } catch (error: any) {
                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            } finally {
                !cancel && setLoading(false)
            }
        })()

        return () => {cancel = true}
    },[enqueueSnackbar])

    const handleDeleteRow = (rowId: number) => {
        let newRows = [...rows]
        let index = newRows.findIndex(row => row.id! === rowId)
        newRows.splice(index, 1)
        setRows(newRows)
    }

    return (
        <>
            <Page title="Места проведения"/>
            <Root>
                <Container maxWidth="xl">
                    <Header/>
                    <Box mt={3}>
                        <Card>
                            <PerfectScrollbar>
                                <Box minWidth={750} sx={{mb: 2}}>
                                    <TableContainer>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>№</TableCell>
                                                    <TableCell>Место</TableCell>
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
                                                                    <TableCell>{row.name}</TableCell>
                                                                    <TableCell style={{ width: 165 }}>
                                                                        <IconButton
                                                                            size="large"
                                                                            component={RouterLink}
                                                                            to={`/event-locations/${row.id}/edit`}
                                                                        >
                                                                            <FiEdit size={20} />
                                                                        </IconButton>
                                                                        <DeleteButtonTable
                                                                            rowId={row.id!}
                                                                            onDelete={eventLocationService.deleteLocation}
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
                        </Card>
                    </Box>
                </Container>
            </Root>
        </>
    );
};

export default EventLocationListView;