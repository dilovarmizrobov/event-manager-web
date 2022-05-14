import React, {useEffect} from 'react';
import {Box, Divider, Drawer, Hidden, List, ListItem, ListSubheader, Typography} from "@mui/material";
import { useLocation } from 'react-router';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Link as RouterLink } from 'react-router-dom';
import {useAppSelector} from "../../../store/hooks";
import {selectAuth} from "../../../store/reducers/authSlice";
import {UserRolesMap} from "../../../constants";
import NavItem from "./NavItem";
import {FiLayout} from "react-icons/fi";
import {FaUsers} from "react-icons/fa";
import {MdEventSeat} from "react-icons/md";
import {IoLocationSharp} from "react-icons/io5";

const navConfig = [
    {
        subheader: 'Home',
        items: [
            {
                title: 'Home',
                icon: FiLayout,
                href: '/home',
            },
            {
                title: 'Мероприятия',
                icon: MdEventSeat,
                href: '/events',
            },
            {
                title: 'Места проведения',
                icon: IoLocationSharp,
                href: '/event-locations',
            },
            {
                title: 'Гости',
                icon: FaUsers,
                href: '/guests',
            },
            {
                title: 'Пользователи',
                icon: FaUsers,
                href: '/users',
            },
            {
                title: 'Страны',
                icon: FaUsers,
                href: '/countries',
            },
            {
                title: 'Шаблоны бейджов',
                icon: FaUsers,
                href: '/badge-templates',
            },
        ]
    },
]

const Index: React.FC<{openMobile: boolean, onMobileClose: VoidFunction}> = ({openMobile, onMobileClose}) => {
    const location = useLocation();
    const {user} = useAppSelector(selectAuth)

    useEffect(() => {
        if (openMobile && onMobileClose) {
            onMobileClose();
        }
        // eslint-disable-next-line
    }, [location.pathname]);

    const content = (
        <Box
            height="100%"
            display="flex"
            flexDirection="column"
        >
            <PerfectScrollbar options={{ suppressScrollX: true }}>
                <Hidden lgUp>
                    <Box
                        p={2}
                        display="flex"
                        justifyContent="center"
                    >
                        <RouterLink to="/" style={{ textDecoration: 'none' }}>
                            <Typography variant="subtitle1" sx={{color: "black"}}>
                                EVENT MANAGER
                            </Typography>
                        </RouterLink>
                    </Box>
                </Hidden>
                <Box p={3}>
                    <Box textAlign="center">
                        <Typography variant="h6">
                            {user!.name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            {UserRolesMap.get(user!.role)}
                            <br/>
                            {user!.email}
                        </Typography>
                    </Box>
                </Box>
                <Divider />
                <Box p={2}>
                    {
                        navConfig.map((config, index) => (
                            <List
                                key={index}
                                subheader={(
                                    <ListSubheader disableGutters disableSticky>{config.subheader}</ListSubheader>
                                )}
                            >
                                {
                                    config.items.map((item, index) => (
                                        <ListItem disablePadding key={index}>
                                            <NavItem
                                                key={index}
                                                href={item.href}
                                                icon={item.icon}
                                                title={item.title}
                                            />
                                        </ListItem>
                                    ))
                                }
                            </List>
                        ))
                    }
                </Box>
            </PerfectScrollbar>
        </Box>
    )
    return (
        <>
            <Drawer
                anchor="left"
                sx={{
                    display: { md: 'block', lg: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 256 },
                }}
                onClose={onMobileClose}
                open={openMobile}
                variant="temporary"
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                }}
            >
                {content}
            </Drawer>
            <Drawer
                anchor="left"
                sx={{
                    display: { xs: 'none', lg: 'block' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: 256,
                        top: 64,
                        height: 'calc(100% - 64px)',
                        zIndex: 1000
                    },
                }}
                open
                variant="permanent"
            >
                {content}
            </Drawer>
        </>
    );
};

export default Index;