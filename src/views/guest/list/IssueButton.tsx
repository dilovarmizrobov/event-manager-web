import React, {useState} from 'react';
import {useSnackbar} from "notistack";
import {Box, CircularProgress, IconButton} from "@mui/material";
import {MdCheck, MdClose} from "react-icons/md";
import {styled} from "@mui/material/styles";
import ConfirmationModal from "../../../components/ConfirmationModal";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import guestService from "../../../services/GuestService";

const StyledCircularProgress = styled(CircularProgress)(() => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: '-22px',
    marginLeft: '-22px',
}))

const IssueButton: React.FC<{rowId: number, badgeIssued: boolean, handleIssue: Function}> = ({rowId, badgeIssued, handleIssue}) => {
    const {enqueueSnackbar} = useSnackbar()
    const [loading, setLoading] = useState(false)
    const [openModal, setOpenModal] = useState(false)

    const handleAccept = async () => {
        try {
            setOpenModal(false)
            setLoading(true)

            await guestService.putIssueBadgeGuest(rowId)

            enqueueSnackbar(`Успешно`, {variant: 'success'})
            handleIssue(rowId)
        } catch (error: any) {
            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        } finally {
            setLoading(false)
        }
    }

    return badgeIssued ? (
        <IconButton size="large">
            <MdCheck size={20} color="green" />
        </IconButton>
    ) : (
        <>
            <Box sx={{position: 'relative', display: 'inline-block'}}>
                <IconButton
                    onClick={() => setOpenModal(true)}
                    disabled={loading}
                    size="large"
                >
                    <MdClose size={20} color="red" />
                </IconButton>
                {loading && <StyledCircularProgress size={44} color='secondary' thickness={2}/>}
            </Box>
            <ConfirmationModal
                isOpen={openModal}
                title={'Вы уверены, что хотите подтвердить выдачу?'}
                description={'При подтверждении данного действия, его нельзя будет отменить. Пожалуйста, убедитесь, что вы хотите выдать именно этот бейдж.'}
                onClose={() => setOpenModal(false)}
                onAccept={handleAccept}
            />
        </>
    )
};

export default IssueButton;