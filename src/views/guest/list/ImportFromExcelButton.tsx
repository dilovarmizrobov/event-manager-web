import React, {useState} from 'react';
import {Button, CircularProgress} from "@mui/material";
import {FiUpload} from "react-icons/fi";
import guestService from "../../../services/GuestService";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import {useSnackbar} from "notistack";
import PERMISSIONS from "../../../constants/permissions";

const ImportFromExcelButton: React.FC<{handleImport: VoidFunction}> = ({handleImport}) => {
    const canImport = PERMISSIONS.IMPORT.GUEST
    const {enqueueSnackbar} = useSnackbar()
    const [loading, setLoading] = useState(false)

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        let file = (e.target as HTMLInputElement).files![0];
        let formDate = new FormData()

        formDate.append("zipFile", file)

        try {
            setLoading(true)
            await guestService.putUploadFromExcel(formDate)
            // const fileBuffer = await guestService.putUploadFromExcel(formDate) as ArrayBuffer
            // const blob = new Blob([fileBuffer], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'});
            // fileSaver.saveAs(blob, `guests-without-photo.xlsx`)

            handleImport()
            enqueueSnackbar(`Успешно загружено`, {variant: 'success'})
        } catch (error: any) {
            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        } finally {
            (e.target as HTMLInputElement).value = ''
            setLoading(false)
        }
    }

    return canImport ? (
        <label>
            <input
                onChange={handleUpload}
                accept="application/x-rar-compressed,application/zip,application/x-gzip"
                type="file"
                style={{display: 'none'}}
            />
            <Button
                color="secondary"
                variant="contained"
                sx={{marginRight: 2}}
                component="span"
                disabled={loading}
                startIcon={loading ? <CircularProgress color="inherit" size={20} /> : <FiUpload />}
            >
                Импорт с Excel
            </Button>
        </label>
    ) : <></>
};

export default ImportFromExcelButton;