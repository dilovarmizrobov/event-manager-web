import React from 'react';
import {Breadcrumbs, Button, Grid, Link, SvgIcon, Typography} from "@mui/material";
import {Link as RouterLink} from "react-router-dom";
import {MdNavigateNext as NavigateNextIcon} from "react-icons/md";
import {FiPlusCircle as PlusCircleIcon} from "react-icons/fi";
import hasPermission from "../../../utils/hasPermisson";
import PERMISSIONS from "../../../constants/permissions";

const Header = () => {
    const canAdd = hasPermission(PERMISSIONS.CREATE.GUEST)

    return (
        <Grid
            container
            justifyContent="space-between"
            spacing={3}
        >
            <Grid item>
                <Breadcrumbs separator={<NavigateNextIcon/>} aria-label="breadcrumb">
                    <Link underline="hover" color="inherit" to="/home" component={RouterLink}>
                        Главная
                    </Link>
                    <Typography color="text.primary">Гости</Typography>
                </Breadcrumbs>
                <Typography variant="h5" color="textPrimary">
                    Гости
                </Typography>
            </Grid>
            {
                canAdd && (
                    <Grid item>
                        <Button
                            color="secondary"
                            variant="contained"
                            component={RouterLink}
                            to="/guests/create"
                        >
                            <SvgIcon sx={{marginRight: 1}}>
                                <PlusCircleIcon />
                            </SvgIcon>
                            Добавить
                        </Button>
                    </Grid>
                )
            }
        </Grid>
    );
};

export default Header;