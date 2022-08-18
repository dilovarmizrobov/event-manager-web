import React, {useEffect, useState} from 'react';
import Page from "../../../components/Page";
import {styled} from "@mui/material/styles";
import {Box, Container, FormControl, Grid, InputLabel, MenuItem, Paper, Select, SelectChangeEvent} from "@mui/material";
import Chart from "./Chart";
import ProgressBar from "./ProgressBar";
import ConversionRates from "./ConversionRates";
import {useSnackbar} from "notistack";
import {IDashboard} from "../../../models/Dashboard";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import LoadingLayout from "../../../components/LoadingLayout";
import appService from "../../../services/AppService";
import {ILocation} from "../../../models/ILocation";
import eventLocationService from "../../../services/EventLocationService";
import {useNavigate} from "react-router-dom";

const Root = styled('div')(({theme}) => ({
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
}))

const DashboardList = () => {
    const [locations, setLocations] = useState<ILocation[]>([])
    const [locationId, setLocationId] = useState<number>()
    const {enqueueSnackbar} = useSnackbar()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [dashboardData, setDashboardData] = useState<IDashboard>()

    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                setLoading(true)

                if (locations.length === 0) {
                    const dataLocation = await eventLocationService.getLocations() as ILocation[]

                    if (dataLocation.length === 0) {
                        navigate(-1)
                        enqueueSnackbar('Добавьте с начала место', {variant: 'info'})
                    } else if (!cancel) {
                        setLocations(dataLocation)
                        setLocationId(dataLocation[0].id!)
                    }
                }

                if (locationId) {
                    const data = await appService.getDashboardData(locationId) as IDashboard

                    if (!cancel) setDashboardData(data)
                }
            } catch (error: any) {
                !cancel && setError(true)
                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            } finally {
                !cancel && setLoading(false)
            }
        })()

        return () => {
            cancel = true
        }
    }, [enqueueSnackbar, locationId, navigate])


    // Location
    const handleChangeLocation = (event: SelectChangeEvent<string | number>) => {
        setLocationId(Number(event.target.value));
    }

    return (
        <>
            <Page title={"Дашборд"}/>
            {
                dashboardData ? (
                    <Root>
                        <Container maxWidth="xl">
                            <Box minWidth={455} sx={{mb: 2, mt: 3}}>
                                <Grid container spacing={3} sx={{display: 'flex', justifyContent: 'flex-end', p: 1}}>
                                    <Grid item>
                                        <Paper
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                            }}
                                        >
                                        <FormControl sx={{minWidth: 120}} size="small" variant="outlined">
                                            <InputLabel shrink id="location-select-label">Место</InputLabel>
                                            <Select
                                                labelId="locationId"
                                                id="location-select"
                                                value={locationId || ''}
                                                label="locationId"
                                                onChange={handleChangeLocation}
                                            >
                                                {locations.map((item, index) => (
                                                    <MenuItem key={index} value={item.id}>{item.name}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        </Paper>
                                    </Grid>
                                </Grid>

                                <Grid container spacing={3}>
                                    {/* ProgressBar */}
                                    <Grid item xs={12} md={4} lg={4}>
                                        <Paper
                                            sx={{
                                                p: 2,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                height: 300,
                                            }}
                                        >
                                            <ProgressBar progress={dashboardData.progress}/>
                                        </Paper>
                                    </Grid>
                                    {/* Chart */}
                                    <Grid item xs={12} md={8} lg={8}>
                                        <Paper
                                            sx={{
                                                p: 2,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                height: 300,
                                            }}
                                        >
                                            <Chart chart={dashboardData.chart}/>
                                        </Paper>
                                    </Grid>
                                    {/* Загруженность по типу бейджов */}
                                    <Grid item xs={12}>
                                        <Paper sx={{p: 2, display: 'flex', flexDirection: 'column'}}>
                                            <ConversionRates rate={dashboardData.rate}/>
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Container>
                    </Root>
                ) : <LoadingLayout loading={loading} error={error}/>
            }
        </>
    );
};

export default DashboardList;
