import React, {useState} from 'react';
import {
    Box,
    Button, CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel, IconButton,
    Radio,
    RadioGroup, SvgIcon, Tooltip
} from "@mui/material";
import {UserRolesEnum} from "../../constants";
import {useAppDispatch, useAppSelector} from "../../store/hooks";
import {selectAuth, updateAuthEvent, updateLocationEvent} from "../../store/reducers/authSlice";
import {NavLink as RouterLink, useNavigate} from "react-router-dom";
import {MdHome} from "react-icons/md";
import {IEventOption} from "../../models/IEvent";
import {ILocation} from "../../models/ILocation";
import eventService from "../../services/EventService";
import errorMessageHandler from "../../utils/errorMessageHandler";
import {useSnackbar} from "notistack";
import {styled} from "@mui/material/styles";
import eventLocationService from "../../services/EventLocationService";

const StyledLoadingRoot = styled(Box)(() => ({
    display: 'flex',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '350px',
}))

const ChooseModal: React.FC<{isTopBar: boolean}> = ({isTopBar}) => {
    const {enqueueSnackbar} = useSnackbar()
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const {user} = useAppSelector(selectAuth)
    const isAdmin = user!.role === UserRolesEnum.ADMIN
    const isGuard = user!.role === UserRolesEnum.GUARD
    const choseOption = isAdmin ? user!.event! : user!.location!
    const [loading, setLoading] = useState(false)
    const [options, setOptions] = useState<IEventOption[] | ILocation[]>([])
    const [openModal, setOpenModal] = useState(false)
    const [value, setValue] = React.useState<IEventOption | ILocation>(choseOption);
    const radioGroupRef = React.useRef<HTMLElement>(null);

    const handleOk = () => {
        isAdmin && dispatch(updateAuthEvent(value as IEventOption))

        isGuard && dispatch(updateLocationEvent(value as ILocation))

        setOpenModal(false)
        navigate(0)
    };

    const handleCancel = () => {
        setOpenModal(false)
        setValue(choseOption)
    }

    const handleEntering = () => {
        if (radioGroupRef.current != null) {
            radioGroupRef.current.focus();
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let valueId = Number((event.target as HTMLInputElement).value)
        setValue(options.find(item => item.id === valueId) || choseOption)
    };

    const handleChooseButton = async () => {
        setOpenModal(true)
        setLoading(true)

        try {
            let data: any;

            if (isAdmin) {
                data = await eventService.getOptionEvents()
            } else {
                data = await eventLocationService.getLocations()
            }

            setOptions(data)
        } catch (error: any) {
            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            setOpenModal(false)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Dialog
                sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
                maxWidth="xs"
                TransitionProps={{ onEntering: handleEntering }}
                open={openModal}
                onClose={() => setOpenModal(false)}
            >
                {
                    loading ? (
                        <StyledLoadingRoot>
                            <CircularProgress size={48}/>
                        </StyledLoadingRoot>
                    ) : (
                        <>
                            <DialogTitle>{isAdmin ? 'Мероприятия' : 'Места проведения'}</DialogTitle>
                            <DialogContent dividers>
                                <RadioGroup
                                    ref={radioGroupRef}
                                    aria-label="ringtone"
                                    name="ringtone"
                                    value={value.id}
                                    onChange={handleChange}
                                >
                                    {options.length > 0 && options.map((option) => (
                                        <FormControlLabel
                                            value={option.id}
                                            key={option.id}
                                            control={<Radio />}
                                            label={option.name}
                                        />
                                    ))}
                                </RadioGroup>
                            </DialogContent>
                            <DialogActions>
                                <Button autoFocus onClick={handleCancel}>
                                    Отмена
                                </Button>
                                <Button onClick={handleOk}>Ок</Button>
                            </DialogActions>
                        </>
                    )
                }
            </Dialog>
            {isAdmin && (
                <Tooltip title="Мероприятия">
                    <IconButton
                        color="inherit"
                        component={RouterLink}
                        to={`/events`}
                    >
                        <SvgIcon>
                            <MdHome />
                        </SvgIcon>
                    </IconButton>
                </Tooltip>
            )}
            <Button sx={{color: isTopBar ? "white" : "black", ml: 2}} variant="outlined" color="inherit" onClick={handleChooseButton}>
                {isTopBar ? choseOption.name : (choseOption.name.slice(0, 13) + (choseOption.name.length > 16 ? '...' : ''))}
            </Button>
        </>
    );
};

export default ChooseModal;