import React, {useEffect} from 'react';
import {Box, Divider, Drawer, Hidden, List, ListItem, ListSubheader, Typography} from "@mui/material";
import { useLocation } from 'react-router';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {useAppSelector} from "../../../store/hooks";
import {selectAuth} from "../../../store/reducers/authSlice";
import {UserRolesEnum, UserRolesMap} from "../../../constants";
import NavItem from "./NavItem";
import hasPermission from "../../../utils/hasPermisson";
import BrandTitle from "../BrandTitle";
import {INavConfig, INavItem} from "../../navConfig";
import AutocompleteInput from "../AutocompleteInput";

const filterNavItem = (items: INavItem[]) => items.filter(item => item.perm ? hasPermission(item.perm) : true)

const Index: React.FC<{openMobile: boolean, onMobileClose: VoidFunction, navConfig: INavConfig[]}> = (props) => {
    const {openMobile, onMobileClose, navConfig} = props
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
                        m={2}
                        display="flex"
                        justifyContent="center"
                    >
                        <BrandTitle isTopBar={false} />
                    </Box>
                </Hidden>
                <Box m={3}>
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
                {
                    (user!.role === UserRolesEnum.ADMIN || user!.role === UserRolesEnum.GUARD) && (
                        <Box px={2} my={3}>
                            <AutocompleteInput />
                        </Box>
                    )
                }
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
                ModalProps={{keepMounted: true}}
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