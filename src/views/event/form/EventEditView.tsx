import React, {useEffect, useState} from 'react';
import {styled} from "@mui/material/styles";
import Page from "../../../components/Page";
import {Box, Container} from "@mui/material";
import Header from "./Header";
import Form from "./Form";
import {useSnackbar} from "notistack";
import {useNavigate, useParams} from "react-router-dom";
import {IEventResponse} from "../../../models/IEvent";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import eventService from "../../../services/EventService";
import LoadingLayout from "../../../components/LoadingLayout";

const Root = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
}))

const EventEditView = () => {
    const {enqueueSnackbar} = useSnackbar()
    const navigate = useNavigate()
    const { eventId } = useParams()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [event, setEvent] = useState<IEventResponse>()

    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                setLoading(true)

                const data: any = await eventService.getEvent(eventId || '')

                if (!cancel) setEvent(data)
            } catch (error: any) {
                !cancel && setError(true)
                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            } finally {
                !cancel && setLoading(false)
            }
        })()

        return () => {cancel = true}
    }, [enqueueSnackbar, eventId, navigate])

    return (
        <>
            <Page title="Изменение мероприятия"/>
            {
                event ? (
                    <Root>
                        <Container maxWidth="xl">
                            <Header title={event.name} />
                            <Box mt={3}>
                                <Form event={event} />
                            </Box>
                        </Container>
                    </Root>
                ) : <LoadingLayout loading={loading} error={error} />
            }
        </>
    );
};

export default EventEditView;