import React, {useEffect, useState} from 'react';
import {styled} from "@mui/material/styles";
import Page from "../../../components/Page";
import {Box, Container} from "@mui/material";
import Header from "./Header";
import Form from "./Form";
import {useSnackbar} from "notistack";
import {useNavigate} from "react-router-dom";
import {ILocation} from "../../../models/ILocation";
import eventLocationService from "../../../services/EventLocationService";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import LoadingLayout from "../../../components/LoadingLayout";

const Root = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
}))

const UserCreateView = () => {
    const {enqueueSnackbar} = useSnackbar()
    const navigate = useNavigate()
    const [locations, setLocations] = useState<ILocation[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                const data: any = await eventLocationService.getLocations()

                if (!cancel) setLocations(data)
            } catch (error: any) {
                !cancel && setError(true)
                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            } finally {
                !cancel && setLoading(false)
            }
        })()

        return () => {cancel = true}
    }, [enqueueSnackbar, navigate])

    return (
        <>
            <Page title="Создание пользователя"/>
            {
                !loading && !error ? (
                    <Root>
                        <Container maxWidth="xl">
                            <Header />
                            <Box mt={3}>
                                <Form locations={locations} />
                            </Box>
                        </Container>
                    </Root>
                ) : <LoadingLayout loading={loading} error={error} />
            }
        </>
    );
};

export default UserCreateView;