import React, {useState} from 'react';
import {useSnackbar} from "notistack";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import badgeService from "../../../services/BadgeService";
import {Box, CircularProgress, IconButton, Tooltip} from "@mui/material";
import {FiDownload} from "react-icons/fi";
import {styled} from "@mui/material/styles";
import ConfirmationModal from "../../../components/ConfirmationModal";


const StyledCircularProgress = styled(CircularProgress)(() => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: '-22px',
    marginLeft: '-22px',
}))

const DownloadBadgeButton :React.FC<{badgeId: number[]}> = ({badgeId}) => {
    const {enqueueSnackbar} = useSnackbar()
    const [loading, setLoading] = useState(false)
    const [isOpen, setOpen] = useState(false)

    const handleAccept = async() => {
        // try {
        //     setOpen(false)
        //     setLoading(true)
        //
        //     let response = await badgeService.getDownloadBadge(badgeId) as Blob
        //
        //     const url = window.URL.createObjectURL(new Blob([response]));
        //     const link = document.createElement('a');
        //     link.href = url;
        //     link.setAttribute('download', `Бейдж № ${badgeId.join(',')}.docx`)
        //     document.body.appendChild(link);
        //     link.click()
        //
        //     enqueueSnackbar(`Успешно получено`, {variant: 'success'})
        // }catch (error:any) {
        //     enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        // }finally {
        //     setLoading(false)
        // }
    }

    return (
        <>
            <Box sx={{position: 'relative', display: 'inline-block'}}>
                <Tooltip title="Скачать">
                    <IconButton
                        size="large"
                        onClick={() => setOpen(true)}
                        disabled={loading}
                    >
                        <FiDownload size={20} />

                    </IconButton>
                </Tooltip>
                {loading && <StyledCircularProgress size={44} color='secondary' thickness={2}/>}
            </Box>
            <ConfirmationModal
                isOpen={isOpen}
                title={"Вы уверены, что хотите скачать бейдж?"}
                description={'Пожалуйста, убедитесь, что вы не ошиблись с выбором.'}
                onClose={() => setOpen(false)}
                onAccept={handleAccept}
            />
        </>
    );
};

export default DownloadBadgeButton;