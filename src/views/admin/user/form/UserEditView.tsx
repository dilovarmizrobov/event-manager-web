import React, {useEffect, useState} from 'react';
import {useSnackbar} from "notistack";
import {useParams} from "react-router-dom";
import {IUserResponse} from "../../../../models/IUser";
import errorMessageHandler from "../../../../utils/errorMessageHandler";
import userService from "../../../../services/UserService";
import Page from "../../../../components/Page";
import LoadingLayout from "../../../../components/LoadingLayout";
import {styled} from "@mui/material/styles";
import {Box, Container} from "@mui/material";
import Header from "./Header";
import Form from "./Form";

const Root = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
}))

const UserEditView = () => {
    const {enqueueSnackbar} = useSnackbar()
    const { userId } = useParams()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [user, setUser] = useState<IUserResponse>();

    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                const data: any = await userService.getUser(userId || '') as IUserResponse

                if (!cancel) setUser(data)
            } catch (error: any) {
                !cancel && setError(true)
                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            } finally {
                !cancel && setLoading(false)
            }
        })()

        return () => {cancel = true}
    }, [enqueueSnackbar, userId])

    return (
        <>
            <Page title="Изменение пользователя" />
            {
                !loading && !error && user ? (
                    <Root>
                        <Container maxWidth="xl">
                            <Header title={user.fullName} />
                            <Box mt={3}>
                               <Form user={user} />
                            </Box>
                        </Container>
                    </Root>
                ) : <LoadingLayout loading={loading} error={error} />
            }
        </>
    );
};

export default UserEditView;