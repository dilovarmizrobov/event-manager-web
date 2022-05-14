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
import {ICountryOption} from "../../../models/ICountry";
import countryService from "../../../services/CountryService";
import {IBadgeOption} from "../../../models/IBadge";
import badgeService from "../../../services/BadgeService";

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
    const [countries, setCountries] = useState<ICountryOption[]>([])
    const [badges, setBadges] = useState<IBadgeOption[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)

    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                setLoading(true)

                const data: any = await eventLocationService.getLocations()
                const dataCountries: any = await countryService.getOptionCountries()
                const dataBadges: any = await badgeService.getOptionBadges()

                if (!cancel) {
                    if (data.length === 0 || dataCountries.length === 0 || dataBadges.length === 0) {
                        navigate(-1)
                        enqueueSnackbar('Добавьте с начала места проведения, шаблоны бейджиков и страны', {variant: 'info'})
                    } else {
                        setLocations(data)
                        setCountries(dataCountries)
                        setBadges(dataBadges)
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
            <Page title="Создание гостя"/>
            {
                locations.length > 0 && countries.length > 0 && badges.length > 0 ? (
                    <Root>
                        <Container maxWidth="xl">
                            <Header />
                            <Box mt={3}>
                                <Form locations={locations} countries={countries} badges={badges} />
                            </Box>
                        </Container>
                    </Root>
                ) : <LoadingLayout loading={loading} error={error} />
            }
        </>
    );
};

export default GuestCreateView;