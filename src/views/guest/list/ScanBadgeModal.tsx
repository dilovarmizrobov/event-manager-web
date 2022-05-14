import React, {useEffect, useState} from 'react';
import {
    Box, CircularProgress,
    Dialog,
    Grid,
    Typography
} from "@mui/material";
import guestService from "../../../services/GuestService";
import {GuestTypeEnum} from "../../../constants";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import {useSnackbar} from "notistack";
import {styled} from "@mui/material/styles";

const StyledBox = styled(Box)(() => ({
    height: 70,
    width: "100%"
}))

const StyledLoadingRoot = styled(Box)(() => ({
    display: 'flex',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '350px',
}))

interface IVerifyGuest {
    id: number;
    barcode: string;
    fullName: string;
    passport: string;
    country: string;
    photo: string;
    type: GuestTypeEnum;
    passed: boolean;
}

const ScanBadgeModal: React.FC = () => {
    const {enqueueSnackbar} = useSnackbar()
    const [verifyGuest, setVerifyGuest] = useState<IVerifyGuest>()
    const [loading, setLoading] = useState(false)
    const [openModal, setOpenModal] = useState(false)

    const verifyGuestHandle = (barcode: string) => {
        (async () => {
            try {
                setOpenModal(true)
                setLoading(true)

                let verifyGuest: any = await guestService.getVerifyGuest(2, barcode)
                setVerifyGuest(verifyGuest)
            } catch (error: any) {
                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
                setOpenModal(false)
            } finally {
                setLoading(false)
            }
        })()
    };

    useEffect(() => {
        let barcode = ''
        let interval: ReturnType<typeof setInterval>

        const handleKeyDown = (event: KeyboardEvent) => {
            if (interval) clearInterval(interval)

            if (event.code === 'Enter') {
                if (barcode) verifyGuestHandle(barcode.replaceAll("Shift", ""))

                barcode = ''
                return
            }

            barcode += event.key

            interval = setInterval(() => barcode = '', 20)
        }

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        }
    }, [])

    return (
        <>
            <Dialog
                open={openModal}
                onClose={() => setOpenModal(false)}
                maxWidth="md"
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <Box sx={{width: 900}}>
                    {
                        loading ? (
                            <StyledLoadingRoot>
                                <CircularProgress size={48} />
                            </StyledLoadingRoot>
                        ) : (
                            <>
                                <StyledBox sx={{ backgroundColor: verifyGuest?.passed ? "#48e574" : "#eb4234" }} />
                                <Grid container alignItems="center" spacing={3} sx={{p: 3}}>
                                    <Grid item xs={5}>
                                        <img src={`/event-manager/guests/load-image/${verifyGuest?.photo}`} alt="..." style={{width: "100%"}}/>
                                    </Grid>
                                    <Grid item xs={7}>
                                        <Grid container spacing={1} alignItems="center" sx={{ mb: 2 }}>
                                            <Grid item xs={6}>
                                                <Typography variant="h6">ФИО:</Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography variant="h6" sx={{ fontWeight: 600 }}>{verifyGuest?.fullName}</Typography>
                                            </Grid>
                                        </Grid>
                                        <Grid container spacing={1} alignItems="center" sx={{ mb: 2 }}>
                                            <Grid item xs={6}>
                                                <Typography variant="h6">Серия паспорта:</Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography variant="h6" sx={{ fontWeight: 600 }}>{verifyGuest?.passport}</Typography>
                                            </Grid>
                                        </Grid>
                                        <Grid container spacing={1} alignItems="center" sx={{ mb: 2 }}>
                                            <Grid item xs={6}>
                                                <Typography variant="h6">Страна:</Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography variant="h6" sx={{ fontWeight: 600 }}>{verifyGuest?.country}</Typography>
                                            </Grid>
                                        </Grid>
                                        <Grid container spacing={1} alignItems="center" sx={{ mb: 2 }}>
                                            <Grid item xs={6}>
                                                <Typography variant="h6">Статус:</Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography variant="h6" sx={{ fontWeight: 600 }}>{verifyGuest?.type}</Typography>
                                            </Grid>
                                        </Grid>
                                        <Grid container spacing={1} alignItems="center">
                                            <Grid item xs={6}>
                                                <Typography variant="h6">Номер пригласительного:</Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography variant="h6" sx={{ fontWeight: 600 }}>{verifyGuest?.barcode}</Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </>
                        )
                    }
                </Box>
            </Dialog>
        </>
    );
};

export default ScanBadgeModal;