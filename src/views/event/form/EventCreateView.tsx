import React from 'react';
import Page from "../../../components/Page";
import {Box, Container} from "@mui/material";
import Header from "./Header";
import {styled} from "@mui/material/styles";
import Form from "./Form";

const Root = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
}))

const EventCreateView = () => {
    return (
        <>
            <Page title="Создание мероприятия"/>
            <Root>
                <Container maxWidth="xl">
                    <Header />
                    <Box mt={3}>
                        <Form/>
                    </Box>
                </Container>
            </Root>
        </>
    );
};

export default EventCreateView;