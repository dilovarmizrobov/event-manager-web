import React, {useEffect, useState} from 'react';
import {useSnackbar} from "notistack";
import {useNavigate, useParams} from "react-router-dom";
import {IBadgeResponse} from "../../../models/IBadge";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import badgeService from "../../../services/BadgeService";
import {styled} from "@mui/material/styles";
import Page from "../../../components/Page";
import {Box, Container} from "@mui/material";
import Header from "./Header"
import LoadingLayout from "../../../components/LoadingLayout";
import Form from "./Form";

const Root = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
}))

const BadgeEditView = () => {
    const {enqueueSnackbar} = useSnackbar()
    const navigate = useNavigate()
    const { badgeId } = useParams()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [badge, setBadge] = useState<IBadgeResponse>()

    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                setLoading(true)

                const data = await badgeService.getBadge(badgeId || '') as IBadgeResponse

                if (!cancel) setBadge(data)
            } catch (error: any) {
                !cancel && setError(true)
                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            } finally {
                !cancel && setLoading(false)
            }
        })()

        return () => {cancel = true}
    }, [enqueueSnackbar, badgeId, navigate])
    return (
        <>
            <Page title="Изменение бейджа"/>
            {
                badge ? (
                    <Root>
                        <Container maxWidth="xl">
                            <Header title={badge.name} />
                            <Box mt={3}>
                                <Form badge={badge} />
                            </Box>
                        </Container>
                    </Root>
                ) : <LoadingLayout loading={loading} error={error} />
            }
        </>
    );
};

export default BadgeEditView;