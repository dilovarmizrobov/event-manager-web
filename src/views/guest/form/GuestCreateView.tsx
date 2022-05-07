import React, {useEffect, useState} from 'react';
import {styled} from "@mui/material/styles";
import Page from "../../../components/Page";
import Header from "./Header";
import {Box, Container} from "@mui/material";
import Form from "./Form";
import {ILocation} from "../../../models/ILocation";
import eventLocationService from "../../../services/EventLocationService";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import {useSnackbar} from "notistack";
import {useNavigate} from "react-router-dom";
import LoadingLayout from "../../../components/LoadingLayout";

const Root = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
}))

const GuestCreateView = () => {
    const {enqueueSnackbar} = useSnackbar()
    const navigate = useNavigate()
    const [locations, setLocations] = useState<ILocation[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)

    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                setLoading(true)

                const data: any = await eventLocationService.getLocations()

                if (!cancel) {
                    if (data.length === 0) {
                        navigate(-1)
                        enqueueSnackbar('Добавьте с начала места проведения', {variant: 'info'})
                    } else {
                        setLocations(data)
                    }
                }
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
            <Page title="Гости"/>
            {
                locations.length > 0 ? (
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

export default GuestCreateView;