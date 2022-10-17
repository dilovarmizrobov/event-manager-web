import React from 'react';
import {Grid, Typography} from "@mui/material";
import ExportFromExcelButton from "../../components/ExportFromExcelButton";
import loggerService from "../../services/LoggerService";

const Header: React.FC = () => {
    return (
        <Grid
            container
            justifyContent="space-between"
            spacing={3}
        >
            <Grid item>
                <Typography variant="h5" color="textPrimary">
                    Логирование
                </Typography>
            </Grid>

            <Grid item>
                <ExportFromExcelButton getExcel={loggerService.getExcelList}/>
            </Grid>

        </Grid>
    );
};

export default React.memo(Header);
