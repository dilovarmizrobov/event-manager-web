import React, {useEffect, useState} from 'react';
import Page from "../../../components/Page";
import {Box, Container} from "@mui/material";
import Header from "./Header";
import Form from "./Form";
import {styled} from "@mui/material/styles";
import {useNavigate, useParams} from "react-router-dom";
import {useSnackbar} from "notistack";
import eventLocationService from "../../../services/EventLocationService";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import {ILocation} from "../../../models/ILocation";
import LoadingLayout from "../../../components/LoadingLayout";

const Root = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
}))

const EventLocationEditView = () => {
    const {enqueueSnackbar} = useSnackbar()
    const navigate = useNavigate()
    let { locationId } = useParams()
    const [location, setLocation] = useState<ILocation>()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)

    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                setLoading(true)

                const data: any = await eventLocationService.getLocation(locationId || '')

                if (!cancel) setLocation(data)
            } catch (error: any) {
                !cancel && setError(true)
                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            } finally {
                !cancel && setLoading(false)
            }
        })()

        return () => {cancel = true}
    }, [enqueueSnackbar, locationId, navigate])

    return (
        <>
            <Page title="Добавление место проведения"/>
            {
                location ? (
                    <Root>
                        <Container maxWidth="xl">
                            <Header />
                            <Box mt={3}>
                                <Form location={location} />
                            </Box>
                        </Container>
                    </Root>
                ): <LoadingLayout loading={loading} error={error} />
             }
        </>
    );
};

export default EventLocationEditView;