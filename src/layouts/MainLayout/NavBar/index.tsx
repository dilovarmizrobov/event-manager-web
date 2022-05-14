import React, {useEffect} from 'react';
import {Box, Divider, Drawer, Hidden, List, ListItem, ListSubheader, Typography} from "@mui/material";
import { useLocation } from 'react-router';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {useAppSelector} from "../../../store/hooks";
import {selectAuth} from "../../../store/reducers/authSlice";
import {UserRolesEnum, UserRolesMap} from "../../../constants";
import NavItem from "./NavItem";
import {FaUsers} from "react-icons/fa";
import {IoLocationSharp} from "react-icons/io5";
import PERMISSIONS from "../../../constants/permissions";
import {IconType} from "react-icons";
import hasPermission from "../../../utils/hasPermisson";
import BrandTitle from "../BrandTitle";

interface INavItem {
    title: string;
    icon: IconType;
    href: string;
    perm?: UserRolesEnum[];
}

interface INavConfig {
    subheader: string;
    items: INavItem[]
}

const navConfig: INavConfig[] = [
    {
        subheader: 'Главная',
        items: [
            {
                title: 'Гости',
                icon: FaUsers,
                href: '/guests',
            },
            {
                title: 'Места проведения',
                icon: IoLocationSharp,
                href: '/event-locations',
                perm: PERMISSIONS.LIST.EVENT_LOCATION,
            },
            {
                title: 'Пользователи',
                icon: FaUsers,
                href: '/users',
                perm: PERMISSIONS.LIST.USER,
            },
            {
                title: 'Страны',
                icon: FaUsers,
                href: '/countries',
                perm: PERMISSIONS.LIST.COUNTRY,
            },
        ]
    },
]

const filterNavItem = (items: INavItem[]) => items.filter(item => item.perm ? hasPermission(item.perm) : true)

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
                        <BrandTitle isTopBar={false} />
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
                        navConfig.map((config, index) => {
                            const items = filterNavItem(config.items)

                            return items.length > 0 && (
                                <List key={index}
                                      subheader={(
                                          <ListSubheader disableGutters disableSticky>{config.subheader}</ListSubheader>
                                      )}
                                >
                                    {
                                        items.map((item, index) => (
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
                            )
                        })
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