import React, {useState} from 'react';
import {useSnackbar} from "notistack";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import {styled} from "@mui/material/styles";
import {Box, CircularProgress, IconButton} from "@mui/material";
import {MdOutlineDone, MdOutlineDoneAll} from "react-icons/md";
import ConfirmationModal from "../../../components/ConfirmationModal";
import eventService from "../../../services/EventService";

const StyledCircularProgress = styled(CircularProgress)(() => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: '-22px',
    marginLeft: '-22px',
}))

const CompletedButton: React.FC<{rowId: number, completed: boolean, handleComplete: Function}> = ({rowId, completed, handleComplete}) => {
    const {enqueueSnackbar} = useSnackbar()
    const [loading, setLoading] = useState(false)
    const [openModal, setOpenModal] = useState(false)

    const handleAccept = async () => {
        try {
            setOpenModal(false)
            setLoading(true)

            const event = await eventService.completeEvent(rowId)

            handleComplete(event)
            enqueueSnackbar(`Успешно завершен`, {variant: 'success'})
        } catch (error: any) {
            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            {
                completed ? (
                    <IconButton size="large" disabled>
                        <MdOutlineDoneAll size={20} />
                    </IconButton>
                ) : (
                    <Box sx={{position: 'relative', display: 'inline-block'}}>
                        <IconButton
                            size="large"
                            onClick={() => setOpenModal(true)}
                            disabled={loading}
                        >
                            <MdOutlineDone size={20} />
                        </IconButton>
                        {loading && <StyledCircularProgress size={44} color='secondary' thickness={2}/>}
                    </Box>
                )
            }
            <ConfirmationModal
                isOpen={openModal}
                title={'Вы уверены, что хотите завершить мероприятие?'}
                description={'При завершение мероприятия, его нельзя будет отменить. Пожалуйста, убедитесь, что вы хотите завершить именно этот мероприятия.'}
                onClose={() => setOpenModal(false)}
                onAccept={handleAccept}
            />
        </>
    );
};

export default CompletedButton;