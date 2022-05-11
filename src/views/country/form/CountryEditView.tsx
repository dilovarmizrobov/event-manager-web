import React, {useEffect, useState} from 'react';
import {styled} from "@mui/material/styles";
import {useSnackbar} from "notistack";
import {useNavigate, useParams} from "react-router-dom";
import Page from "../../../components/Page";
import {Box, Container} from "@mui/material";
import Header from "./Header";
import Form from "./Form";
import {ICountryResponse} from "../../../models/ICountry";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import countryService from "../../../services/CountryService";
import LoadingLayout from "../../../components/LoadingLayout";

const Root = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
}))

const CountryEditView = () => {
    const {enqueueSnackbar} = useSnackbar()
    const navigate = useNavigate()
    const { countryId } = useParams()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [country, setCountry] = useState<ICountryResponse>()

    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                setLoading(true)

                const data: any = await countryService.getCountry(countryId || '')

                if (!cancel) setCountry(data)
            } catch (error: any) {
                !cancel && setError(true)
                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            } finally {
                !cancel && setLoading(false)
            }
        })()

        return () => {cancel = true}
    }, [enqueueSnackbar, countryId, navigate])

    return (
        <>
            <Page title="Изменение страна"/>
            {
                country ? (
                        <Root>
                            <Container maxWidth="xl">
                                <Header title={country?.name} />
                                <Box>
                                    <Form country={country} />
                                </Box>
                            </Container>
                        </Root>
                    )
                    : <LoadingLayout loading={loading} error={error} />
            }
        </>
    );
};

export default CountryEditView;