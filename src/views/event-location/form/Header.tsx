import React from 'react';
import {Breadcrumbs, Grid, Link, Typography} from "@mui/material";
import {Link as RouterLink} from "react-router-dom";
import {MdNavigateNext as NavigateNextIcon} from "react-icons/md";

const Header: React.FC<{title?: string}> = ({title}) => (
    <Grid container justifyContent="space-between" spacing={3}>
        <Grid item>
            <Breadcrumbs separator={<NavigateNextIcon/>} aria-label="breadcrumb">
                <Link underline="hover" color="inherit" to="/event-locations" component={RouterLink}>
                    Места проведения
                </Link>
                <Typography color="text.primary">{title ? 'Изменение' : 'Создание'}</Typography>
            </Breadcrumbs>
            <Typography variant="h5" color="textPrimary">
                {title ? 'Изменение место проведения' : 'Создание место проведения'}
            </Typography>
        </Grid>
    </Grid>
);

export default Header;