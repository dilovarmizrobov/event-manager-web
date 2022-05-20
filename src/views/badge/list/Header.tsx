import React from 'react';
import {Button, Grid, SvgIcon, Typography} from "@mui/material";
import {Link as RouterLink} from "react-router-dom";
import {FiPlusCircle as PlusCircleIcon} from "react-icons/fi";

const Header = () => {
    return (
        <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            spacing={3}
        >
            <Grid item>
                <Typography variant="h5" color="textPrimary">
                    Шаблоны бейджов
                </Typography>
            </Grid>
            <Grid item>
                <Button
                    color="secondary"
                    variant="contained"
                    component={RouterLink}
                    to="/badge-templates/create"
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