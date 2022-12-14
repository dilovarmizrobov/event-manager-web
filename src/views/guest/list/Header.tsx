import React from 'react';
import {Button, Grid, SvgIcon, Typography} from "@mui/material";
import {Link as RouterLink} from "react-router-dom";
import {FiPlusCircle as PlusCircleIcon} from "react-icons/fi";
import ImportFromExcelButton from "./ImportFromExcelButton";
import hasPermission from "../../../utils/hasPermisson";
import PERMISSIONS from "../../../constants/permissions";
import ExportFromExcelButton from "../../../components/ExportFromExcelButton";
import guestService from "../../../services/GuestService";

const Header: React.FC<{setUpdate: Function}> = ({setUpdate}) => {
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
                        <ExportFromExcelButton getExcel={guestService.getGuestsExcelList}/>
                        <ImportFromExcelButton handleImport={() => setUpdate()}/>
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

export default React.memo(Header);
