import React from 'react';
import {styled} from "@mui/material/styles";
import Page from "../../../components/Page";
import Header from "./Header";
import {Box, Container} from "@mui/material";

const Root = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
}))

const GuestCreateView = () => {
    return (
        <Root>
            <Page title="Гости"/>
            <Container maxWidth="xl">
                <Header />
                <Box mt={3}>

                </Box>
            </Container>
        </Root>
    );
};

export default GuestCreateView;