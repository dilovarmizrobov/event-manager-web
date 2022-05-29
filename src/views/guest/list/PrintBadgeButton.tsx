import React, {useState} from 'react';
import {useSnackbar} from "notistack";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import ConfirmationModal from "../../../components/ConfirmationModal";
import {Box, CircularProgress, IconButton, Tooltip} from "@mui/material";
import {styled} from "@mui/material/styles";
import {FiPrinter} from "react-icons/fi";
import guestService from "../../../services/GuestService";

const StyledCircularProgress = styled(CircularProgress)(() => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: '-22px',
    marginLeft: '-22px',
}))

const PrintBadgeButton: React.FC<{guestsId: number[], page: number}> = ({guestsId, page}) => {
    const {enqueueSnackbar} = useSnackbar()
    const [loading, setLoading] = useState(false)
    const [isOpen, setOpen] = useState(false)

    const handleAccept = async () => {
        try {
            setOpen(false)
            setLoading(true)

            let response = await guestService.getPrintBadgeGuests(guestsId) as Blob

            const url = window.URL.createObjectURL(new Blob([response]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `badges_${page}_${guestsId.length}.pdf`);
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
                <Tooltip title="Печать">
                    <IconButton
                        size="large"
                        onClick={() => setOpen(true)}
                        disabled={loading}
                    >
                        <FiPrinter size={20}/>
                    </IconButton>
                </Tooltip>
                {loading && <StyledCircularProgress size={44} color='secondary' thickness={2}/>}
            </Box>
            <ConfirmationModal
                isOpen={isOpen}
                title={"Вы уверены, что хотите создать бейдж?"}
                description={'Пожалуйста, убедитесь, что вы не ошиблись с выбором гостя.'}
                onClose={() => setOpen(false)}
                onAccept={handleAccept}
            />
        </>
    );
};

export default PrintBadgeButton;