import React, {useState} from 'react';
import {Box, Button, CircularProgress} from "@mui/material";
import {useSnackbar} from "notistack";
import errorMessageHandler from "../../utils/errorMessageHandler";
import ConfirmationModal from "../../components/ConfirmationModal";
import {styled} from "@mui/material/styles";
import loggerService from "../../services/LoggerService";

const StyledCircularProgress = styled(CircularProgress)(() => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: '-22px',
    marginLeft: '-22px',
}))

const ExportportFromExcelButton: React.FC<{page: number}> = ({page}) => {
    const {enqueueSnackbar} = useSnackbar()
    const [loading, setLoading] = useState(false)
    const [isOpen, setOpen] = useState(false)

    const handleAccept = async () => {
        try {
            setOpen(false)
            setLoading(true)

            let response = await loggerService.getExcelList() as Blob

            const url = window.URL.createObjectURL(new Blob([response]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `logger_${page}.xlsx`);
            document.body.appendChild(link);
            link.click();

            enqueueSnackbar(`Успешно получено`, {variant: 'success'})
        } catch (error: any) {
            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Box sx={{position: 'relative', display: 'inline-block'}}>
                {/*<Tooltip title="Печать">*/}
                {/*    <IconButton*/}
                {/*        size="large"*/}
                {/*        onClick={() => setOpen(true)}*/}
                {/*        disabled={loading}*/}
                {/*    >*/}
                {/*        <FiPrinter size={20}/>*/}
                {/*    </IconButton>*/}
                {/*</Tooltip>*/}
                <Button
                    color="secondary"
                    variant="contained"
                    sx={{marginRight: 2}}
                    component="span"
                    onClick={() => setOpen(true)}
                    disabled={loading}
                >
                    Экспорт с Excel
                </Button>
                {loading && <StyledCircularProgress size={44} color='secondary' thickness={2}/>}
            </Box>
            <ConfirmationModal
                isOpen={isOpen}
                title={"Вы уверены, что хотите загрузить файл?"}
                onClose={() => setOpen(false)}
                onAccept={handleAccept}
            />
        </>
    );
};

export default ExportportFromExcelButton;
