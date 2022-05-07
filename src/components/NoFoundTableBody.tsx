import React from "react";
import {CircularProgress, TableBody, TableCell, TableRow, Typography} from "@mui/material";

const NoFoundTableBody: React.FC<{loading: boolean}> = ({loading}) => (
    <TableBody>
        <TableRow>
            <TableCell colSpan={50} align="center" sx={{height: 250}}>
                {loading ? <CircularProgress size={48}/> : <Typography display="block">Не найдено ни одной записи</Typography>}
            </TableCell>
        </TableRow>
    </TableBody>
)

export default NoFoundTableBody
