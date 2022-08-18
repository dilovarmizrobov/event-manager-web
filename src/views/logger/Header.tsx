import React from 'react';
import {Grid, Typography} from "@mui/material";
import ExportportFromExcelButton from "./ExportportFromExcelButton";

const Header: React.FC<{ page: number }> = ({page}) => {
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
                <ExportportFromExcelButton page={page}/>
            </Grid>

        </Grid>
    );
};

export default React.memo(Header);
