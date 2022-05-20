import React from "react";
import Page from "../components/Page";
import {Box, Button, Container, Typography, useMediaQuery, useTheme} from "@mui/material";
import {styled} from "@mui/material/styles";
import {Link as RouterLink} from 'react-router-dom';

const Root = styled('div')(({theme}) => ({
    backgroundColor: theme.palette.background.default,
    minHeight: '100%',
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(3),
    paddingTop: 80,
    paddingBottom: 80
}))

const Image = styled('img')(() => ({
    maxWidth: '100%',
    maxHeight: 600,
    height: 'auto'
}))

const Error404: React.FC = () => {
    const theme = useTheme();
    const mobileDevice = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Root>
            <Page
                title="Нет такой страницы"
            />
            <Container maxWidth="lg">
                <Typography
                    align="center"
                    variant={mobileDevice ? 'h6' : 'h3'}
                    color="textPrimary"
                >
                    Ошибка 404. Нет такой страницы
                </Typography>
                <Box display="flex" justifyContent="center">
                    <Image
                        alt="404"
                        src="https://duob.org/static/page_not_found.svg"
                    />
                </Box>
                <Box display="flex" justifyContent="center">
                    <Button
                        color="secondary"
                        component={RouterLink}
                        to="/"
                        variant="outlined"
                    >
                        На главную
                    </Button>
                </Box>
            </Container>

        </Root>
    )
}

export default Error404