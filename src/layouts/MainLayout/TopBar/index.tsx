import React from "react";
import {AppBar, Box, Hidden, IconButton, SvgIcon, Toolbar} from "@mui/material";
import {FiMenu} from 'react-icons/fi';
import {styled} from "@mui/material/styles";
import Logout from "./Logout";
import ThemeMode from "./ThemeMode";
import BrandTitle from "../BrandTitle";
import {UserRolesEnum} from "../../../constants";
import {NavLink as RouterLink} from "react-router-dom";
import {useAppSelector} from "../../../store/hooks";
import {selectAuth} from "../../../store/reducers/authSlice";
import {GoHome} from "react-icons/go";

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

const TopBar: React.FC<{onMobileNavOpen: VoidFunction}> = ({onMobileNavOpen}) => {
    const {user} = useAppSelector(selectAuth)

    return (
        <Root>
            <AppBar className={classes.root}>
                <Toolbar className={classes.toolbar}>
                    <Hidden lgUp>
                        <IconButton
                            color="inherit"
                            onClick={onMobileNavOpen}
                        >
                            <FiMenu/>
                        </IconButton>
                    </Hidden>
                    <Hidden lgDown>
                        <BrandTitle isTopBar={true} />
                    </Hidden>
                    <Box ml={2} flexGrow={1}/>
                    {user!.role === UserRolesEnum.ADMIN && (
                        <IconButton
                            color="inherit"
                            component={RouterLink}
                            to={`/events`}
                        >
                            <SvgIcon>
                                <GoHome />
                            </SvgIcon>
                        </IconButton>
                    )}
                    <ThemeMode/>
                    <Logout/>
                </Toolbar>
            </AppBar>
        </Root>
    )
}

export default TopBar