import React, {useState} from "react";
import {
    AppBar,
    Box,
    Button,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Menu,
    MenuItem,
    Toolbar,
    Typography
} from "@mui/material";
import {Link as RouterLink, useMatch} from "react-router-dom";
import {styled} from "@mui/material/styles";
import Logout from "../MainLayout/TopBar/Logout";
import ThemeMode from "../MainLayout/TopBar/ThemeMode";
import {FiMenu} from "react-icons/fi";

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

interface MenuConfigItem {
    path: string;
    title: string;
}

const menuConfig: MenuConfigItem[] = [
    {
        path: '/events',
        title: 'Мероприятия'
    },
    {
        path: '/admin/users',
        title: 'Пользователи'
    },
];

const TopBar: React.FC = () => {
    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
    const [anchorElList, setAnchorElList] = React.useState<null | HTMLElement>(null);
    const [selectedIndex, setSelectedIndex] = React.useState(menuConfig.findIndex(item => item.path === window.location.pathname) | 0);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleClickListItem = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElList(event.currentTarget);
    };

    const handleCloseList = () => {
        setAnchorElList(null);
    };

    const handleListMenuItemClick = (event: React.MouseEvent<HTMLElement>, index: number) => {
        setSelectedIndex(index);
        setAnchorElList(null);
    };

    return (
        <Root>
            <AppBar className={classes.root}>
                <Toolbar className={classes.toolbar}>
                    <Typography
                        variant="h6"
                        component={RouterLink}
                        to={"/events"}
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.2rem',
                            color: 'white',
                            textDecoration: 'none',
                        }}
                    >
                        EVENT MANAGER
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <FiMenu/>
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{display: { xs: 'block', md: 'none' },}}
                        >
                            <MenuItem onClick={handleCloseNavMenu}>
                                <Typography
                                    textAlign="center"
                                    component={RouterLink}
                                    to="/events"
                                    sx={{
                                        color: 'inherit',
                                        textDecoration: 'none',
                                    }}
                                >
                                    Мероприятия
                                </Typography>
                            </MenuItem>
                            <MenuItem onClick={handleCloseNavMenu}>
                                <Typography
                                    textAlign="center"
                                    component={RouterLink}
                                    to="/admin/users"
                                    sx={{
                                        color: 'inherit',
                                        textDecoration: 'none',
                                    }}
                                >
                                    Пользователи
                                </Typography>
                            </MenuItem>
                        </Menu>
                    </Box>
                    <Typography
                        variant="h6"
                        noWrap
                        component={RouterLink}
                        to={"/events"}
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.2rem',
                            color: 'white',
                            textDecoration: 'none',
                        }}
                    >
                        EVENT MANAGER
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        <List component="nav">
                            <ListItem button onClick={handleClickListItem}>
                                <ListItemText primary={menuConfig[selectedIndex].title}/>
                            </ListItem>
                        </List>
                        <Menu
                            anchorEl={anchorElList}
                            open={Boolean(anchorElList)}
                            onClose={handleCloseList}
                            PaperProps={{
                                sx: {
                                    overflow: 'visible',
                                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                    mt: 1,
                                }
                            }}
                        >
                            {
                                menuConfig.map((option, index) => (
                                    <MenuItem
                                        key={index}
                                        selected={index === selectedIndex}
                                        component={RouterLink}
                                        to={option.path}
                                        onClick={(event: React.MouseEvent<HTMLElement>) => handleListMenuItemClick(event, index)}
                                    >
                                        {option.title}
                                    </MenuItem>
                                ))
                            }
                        </Menu>
                    </Box>
                    <ThemeMode/>
                    <Logout/>
                </Toolbar>
            </AppBar>
        </Root>
    )
}

export default TopBar