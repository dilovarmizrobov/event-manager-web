import React from "react";
import {AppBar, Box, Toolbar, Typography} from "@mui/material";
import {Link as RouterLink} from "react-router-dom";
import {styled} from "@mui/material/styles";
import Logout from "../MainLayout/TopBar/Logout";
import ThemeMode from "../MainLayout/TopBar/ThemeMode";

const PREFIX = "TopBar"
const classes = {
    root: `${PREFIX}-root`,
    toolbar: `${PREFIX}-toolbar`,
}

const Root = styled('div')(({ theme }) => ({
    [`& .${classes.root}`]: {
        ...theme.palette.mode === 'light' ? {
            boxShadow: 'none',
            backgroundColor: theme.palette.primary.main
        } : {},
        ...theme.palette.mode === 'dark' ? {
            backgroundColor: theme.palette.background.default
        } : {}
    },
    [`& .${classes.toolbar}`]: {
        minHeight: 64,
    },
}))

const TopBar: React.FC = () => {
    return (
        <Root>
            <AppBar className={classes.root}>
                <Toolbar className={classes.toolbar}>
                    <RouterLink to="/events" style={{ textDecoration: 'none' }}>
                        <Typography variant="subtitle1" sx={{color: "white"}}>
                            EVENT MANAGER
                        </Typography>
                    </RouterLink>
                    <Box ml={2} flexGrow={1}/>
                    <ThemeMode/>
                    <Logout/>
                </Toolbar>
            </AppBar>
        </Root>
    )
}

export default TopBar