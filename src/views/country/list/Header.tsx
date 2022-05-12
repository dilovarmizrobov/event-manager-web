import React from 'react';
import {Breadcrumbs, Button, Grid, Link, SvgIcon, Typography} from "@mui/material";
import {Link as RouterLink} from "react-router-dom";
import {MdNavigateNext as NavigateNextIcon} from "react-icons/md";
import {FiPlusCircle as PlusCircleIcon} from "react-icons/fi";

const Header = () => {
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
                    <Typography color="text.primary">Страны</Typography>
                </Breadcrumbs>
                <Typography variant="h5" color="textPrimary">
                    Страны
                </Typography>
            </Grid>
            <Grid item>
                <Button
                    color="secondary"
                    variant="contained"
                    component={RouterLink}
                    to="/countries/create"
                >
                    <SvgIcon sx={{marginRight: 1}}>
                        <PlusCircleIcon />
                    </SvgIcon>
                        Добавить
                </Button>
            </Grid>
        </Grid>
    );
};

export default Header;