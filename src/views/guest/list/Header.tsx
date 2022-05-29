import React from 'react';
import {Button, Grid, SvgIcon, Typography} from "@mui/material";
import {Link as RouterLink} from "react-router-dom";
import {FiPlusCircle as PlusCircleIcon} from "react-icons/fi";
import hasPermission from "../../../utils/hasPermisson";
import PERMISSIONS from "../../../constants/permissions";
import ImportFromExcelButton from "./ImportFromExcelButton";

const Header: React.FC<{setUpdateRows: Function}> = ({setUpdateRows}) => {
    const canAdd = hasPermission(PERMISSIONS.CREATE.GUEST)

    return (
        <Grid
            container
            justifyContent="space-between"
            spacing={3}
        >
            <Grid item>
                <Typography variant="h5" color="textPrimary">
                    Гости
                </Typography>
            </Grid>
            {
                canAdd && (
                    <Grid item>
                        <ImportFromExcelButton handleImport={() => setUpdateRows()} />
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