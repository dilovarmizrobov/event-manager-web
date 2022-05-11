import React, {useEffect, useState} from 'react';
import {useSnackbar} from "notistack";
import {useNavigate, useParams} from "react-router-dom";
import {ILocation} from "../../../models/ILocation";
import eventLocationService from "../../../services/EventLocationService";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import Page from "../../../components/Page";
import {Box, Container} from "@mui/material";
import Header from "./Header";
import Form from "./Form";
import LoadingLayout from "../../../components/LoadingLayout";
import {styled} from "@mui/material/styles";
import {IGuest} from "../../../models/IGuest";
import guestService from "../../../services/GuestService";
import {ICountryResponse} from "../../../models/ICountry";
import countryService from "../../../services/CountryService";

const Root = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
}))

const GuestEditView: React.FC = () => {
    const {enqueueSnackbar} = useSnackbar()
    const navigate = useNavigate()
    let {guestId} = useParams();
    const [locations, setLocations] = useState<ILocation[]>([])
    const [countries, setCountries] = useState<ICountryResponse[]>([])
    const [guest, setGuest] = useState<IGuest>()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)

    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                setLoading(true)

                const data: any = await eventLocationService.getLocations()
                const dataGuest: any = await guestService.getGuest(guestId || '')
                const dataCountries: any = await countryService.getCountries()

                if (!cancel) {
                    if (data.length === 0 || dataCountries.length === 0) {
                        navigate(-1)
                        enqueueSnackbar('Добавьте с начала места проведения и страны', {variant: 'info'})
                    } else {
                        setLocations(data)
                        setCountries(dataCountries)
                        setGuest(dataGuest)
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
    }, [enqueueSnackbar, guestId, navigate])

    const formattingGuest = (guest: IGuest) => {
        guest.locations = (guest.locations as ILocation[]).map(item => item.id!)
        guest.passportImage = `/event-manager/guests/load-image/${guest.passportImage}`;
        guest.photo = `/event-manager/guests/load-image/${guest.photo}`;
        return guest
    }

    return (
        <>
            <Page title="Гости"/>
            {
                locations.length > 0 && countries.length > 0 && guest ? (
                    <Root>
                        <Container maxWidth="xl">
                            <Header title={guest.fullName} />
                            <Box mt={3}>
                                <Form locations={locations} countries={countries} guest={formattingGuest(guest)} />
                            </Box>
                        </Container>
                    </Root>
                ) : <LoadingLayout loading={loading} error={error} />
            }
        </>
    );
};

export default GuestEditView;