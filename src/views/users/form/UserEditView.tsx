import React, {useEffect, useState} from 'react';
import {useSnackbar} from "notistack";
import {useNavigate, useParams} from "react-router-dom";
import {IUserResponse} from "../../../models/IUser";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import userService from "../../../services/UserService";
import Page from "../../../components/Page";
import LoadingLayout from "../../../components/LoadingLayout";
import {styled} from "@mui/material/styles";
import {Box, Container} from "@mui/material";
import Header from "./Header";
import Form from "./Form";
import {ILocation} from "../../../models/ILocation";
import eventLocationService from "../../../services/EventLocationService";

const Root = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
}))

const UserEditView = () => {
    const {enqueueSnackbar} = useSnackbar()
    const navigate = useNavigate()
    const { userId } = useParams()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [user, setUser] = useState<IUserResponse>();
    const [locations, setLocations] = useState<ILocation[]>([])

    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                setLoading(true)

                const dataLocation: any = await eventLocationService.getLocations()
                const data: any = await userService.getUser(userId || '') as IUserResponse

                if (!cancel) {
                    if(data.length === 0 || dataLocation.length === 0){
                        navigate(-1)
                        enqueueSnackbar('Добавьте с начала места проведения', {variant: 'info'})
                    }else {
                        setUser(data)
                        setLocations(dataLocation)
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
    }, [enqueueSnackbar, userId, navigate])

    return (
        <>
          <Page title="Изменение пользователя" />
            {
               locations.length > 0 &&  user ? (
                       <Root>
                           <Container maxWidth="xl">
                               <Header title={user.fullName} />
                               <Box mt={3}>
                                   <Form locations={locations} user={user} />
                               </Box>
                           </Container>
                       </Root>
                    )
                    : <LoadingLayout loading={loading} error={error} />
            }
        </>
    );
};

export default UserEditView;