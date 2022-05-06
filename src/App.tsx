import React from 'react';
import Routes from "./routes";
import {BrowserRouter} from "react-router-dom";
import {ThemeProvider} from "@mui/material/styles";
import CssBaseline from '@mui/material/CssBaseline';
import createGlobalTheme from "./theme";
import Auth from "./components/Auth";
import useSettings from "./hooks/useSettings";
import {GlobalStyles} from "@mui/material";

const inputGlobalStyles = <GlobalStyles styles={{
    '*': {
        boxSizing: 'border-box',
        margin: 0,
        padding: 0
    },
    html: {
        '-webkit-font-smoothing': 'antialiased',
        '-moz-osx-font-smoothing': 'grayscale',
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
            <Auth>
                <BrowserRouter>
                    <Routes />
                </BrowserRouter>
            </Auth>
        </ThemeProvider>
    );
}

export default App;
