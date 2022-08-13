import React, {useEffect, useState} from 'react';
import Page from "../../../components/Page";
import {styled} from "@mui/material/styles";
import {Box, Container, Grid, Paper} from "@mui/material";
import Chart from "./Chart";
import ProgressBar from "./ProgressBar";
import ConversionRates from "../../logger/ConversionRates";
import {useSnackbar} from "notistack";
import {IDashboard} from "../../../models/Dashboard";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import LoadingLayout from "../../../components/LoadingLayout";
import appService from "../../../services/AppService";

const Root = styled('div')(({theme}) => ({
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
}))

const DashboardList = () => {
    const {enqueueSnackbar} = useSnackbar()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [dashboardData, setDashboardData] = useState<IDashboard>()

    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                setLoading(true)

                const data = await appService.getDashboardData() as IDashboard

                if (!cancel) setDashboardData(data)
            } catch (error: any) {
                !cancel && setError(true)
                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            } finally {
                !cancel && setLoading(false)
            }
        })()

        return () => {cancel = true}
    }, [enqueueSnackbar])

    return (
        <>
            <Page title={"Дашборд"}/>
            {
                dashboardData ? (
                    <Root>
                        <Container maxWidth="xl">
                            <Box minWidth={455} sx={{mb: 2, mt: 3}}>
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
                                            <Chart chart={dashboardData.chart} />
                                        </Paper>
                                    </Grid>
                                    {/* Загруженность по типу бейджов */}
                                    <Grid item xs={12}>
                                        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column'}}>
                                            <ConversionRates rate={dashboardData.rate} />
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Container>
                    </Root>
                ) : <LoadingLayout loading={loading} error={error} />
            }
        </>
    );
};

export default DashboardList;
