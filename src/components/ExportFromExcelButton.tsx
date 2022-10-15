import React, {useState} from 'react';
import {Box, Button, CircularProgress} from "@mui/material";
import {FiUpload} from "react-icons/fi";
import ConfirmationModal from "../../../components/ConfirmationModal";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import {useSnackbar} from "notistack";

const ExportFromExcelButton: React.FC<{getExcel: Function}> = ({getExcel}) => {
    const [loading, setLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const {enqueueSnackbar} = useSnackbar()

    const handleAccept = async () => {
        try {
            setIsOpen(false)
            setLoading(true)

            // let res = await guestService.getGuestsExcelList() as Blob
            let res = await getExcel() as Blob

            const url = window.URL.createObjectURL(new Blob([res]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `guests.xlsx`)
            document.body.appendChild(link)
            link.click()

        enqueueSnackbar(`Успешно получено`, {variant: 'success'})
    }
    catch (error: any) {
        enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
    }
    finally {
        setLoading(false)
    }
}

    return (
        <>
            <Box sx={{position: 'relative', display: 'inline-block'}}>
                <Button
                    color="secondary"
                    variant="contained"
                    sx={{marginRight: 2}}
                    component="span"
                    onClick={() => setIsOpen(true)}
                    disabled={loading}
                    startIcon={loading ? <CircularProgress color="inherit" size={20} /> : <FiUpload />}
                >
                    Экспорт в Excel
                </Button>
            </Box>
            <ConfirmationModal
                isOpen={isOpen}
                title={"Вы уверены, что хотите загрузить файл?"}
                onClose={() => setIsOpen(false)}
                onAccept={handleAccept}
            />
        </>
    );
};

export default ExportFromExcelButton;