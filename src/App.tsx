import React from 'react';
import {SnackbarProvider} from "notistack";
import CssBaseline from '@mui/material/CssBaseline';
import {BrowserRouter} from "react-router-dom";
import {ThemeProvider} from "@mui/material/styles";
import {GlobalStyles} from "@mui/material";
import Routes from "./routes";
import createGlobalTheme from "./theme";
import Auth from "./components/Auth";
import useSettings from "./hooks/useSettings";

const inputGlobalStyles = <GlobalStyles styles={{
    '*': {
        boxSizing: 'border-box',
        margin: 0,
        padding: 0
    },
    html: {
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        height: '100%',
        width: '100%'
    },
    body: {
        height: '100%',
        width: '100%'
    },
    '#root': {
        height: '100%',
        width: '100%'
    }
}} />;

function App() {
    const {settings} = useSettings();

    return (
        <ThemeProvider theme={createGlobalTheme(settings)}>
            {inputGlobalStyles}
            <GlobalStyles styles={{ h1: { color: 'grey' } }} />
            <CssBaseline />
            <SnackbarProvider maxSnack={3} autoHideDuration={5000}>
                <Auth/>
                <BrowserRouter>
                    <Routes />
                </BrowserRouter>
            </SnackbarProvider>
        </ThemeProvider>
    );
}

export default App;
