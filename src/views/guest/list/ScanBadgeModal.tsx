import React, {useEffect, useState} from 'react';
import {
    Box, ButtonProps, CircularProgress,
    Dialog,
    Grid, IconButton,
    Typography
} from "@mui/material";
import guestService from "../../../services/GuestService";
import {GuestTypeEnum} from "../../../constants";
import {styled} from "@mui/material/styles";
import {MdClose, MdCheck} from "react-icons/md";
import {purple} from "@mui/material/colors";

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
    hasFloater: boolean;
}

const FloaterButton = styled(IconButton)<ButtonProps>(({ theme }) => ({
    color: theme.palette.getContrastText(purple[500]),
    backgroundColor: '#48e574',
    '&:hover': {
        backgroundColor: '#48e574',
    },
}));

const ScanBadgeModal: React.FC<{barcode?: string}> = ({barcode}) => {
    const [verifyGuest, setVerifyGuest] = useState<IVerifyGuest>()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [openModal, setOpenModal] = useState(false)

    const verifyGuestHandle = (barcode: string) => {
        (async () => {
            try {
                setError(false)
                setOpenModal(true)
                setLoading(true)

                let verifyGuest: any = await guestService.getVerifyGuest(barcode)
                setVerifyGuest(verifyGuest)
            } catch (error: any) {
                setError(true)
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

    useEffect(() => {
        barcode && verifyGuestHandle(barcode)
    }, [barcode])

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
                            error ? (
                                <StyledLoadingRoot>
                                    <h3>Не зарегистрирован в системе</h3>
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
                                                    <Typography variant="h6">ID:</Typography>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>{verifyGuest?.id}</Typography>
                                                </Grid>
                                            </Grid>
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
                                                    <Typography variant="h6">Флотер:</Typography>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                        {verifyGuest?.hasFloater ? (
                                                            <FloaterButton>
                                                                <MdCheck size={20}/>
                                                            </FloaterButton>
                                                        ) : (
                                                            <FloaterButton sx={{
                                                                backgroundColor: '#eb4234',
                                                                '&:hover': {
                                                                    backgroundColor: '#eb4234',
                                                                }}}
                                                            >
                                                                <MdClose size={20}/>
                                                            </FloaterButton>
                                                        )}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </>
                            )
                        )
                    }
                </Box>
            </Dialog>
        </>
    );
};

export default React.memo(ScanBadgeModal);