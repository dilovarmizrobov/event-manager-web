import React from 'react';
import {Autocomplete, CircularProgress, InputAdornment, Paper, TextField} from "@mui/material";
import {useAppDispatch, useAppSelector} from "../../store/hooks";
import {selectAuth, updateAuthEvent, updateLocationEvent} from "../../store/reducers/authSlice";
import {IEventOption} from "../../models/IEvent";
import {ILocation} from "../../models/ILocation";
import eventService from "../../services/EventService";
import eventLocationService from "../../services/EventLocationService";
import errorMessageHandler from "../../utils/errorMessageHandler";
import {UserRolesEnum} from "../../constants";
import {useSnackbar} from "notistack";
import {useNavigate} from "react-router-dom";

const AutocompleteInput: React.FC = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const {enqueueSnackbar} = useSnackbar()
    const [open, setOpen] = React.useState(false);
    const [options, setOptions] = React.useState<readonly IEventOption[] | ILocation[]>([]);
    const loading = open && options.length === 0;
    const {user} = useAppSelector(selectAuth)
    const isAdmin = user!.role === UserRolesEnum.ADMIN
    const isGuard = user!.role === UserRolesEnum.GUARD
    const defaultValue = isAdmin ? user!.event! : user!.location!

    React.useEffect(() => {
        let active = true;

        if (!loading) {
            return undefined;
        }

        (async () => {
            try {
                let data: any;

                if (isAdmin) {
                    data = await eventService.getOptionEvents()
                } else {
                    data = await eventLocationService.getGuardOptionLocations()
                }

                if (active) {
                    setOptions(data)
                }
            } catch (error: any) {
                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            }
        })();

        return () => {
            active = false;
        };
    }, [loading]);

    React.useEffect(() => {
        if (!open) {
            setOptions([]);
        }
    }, [open]);

    const handleChange = (value: ILocation | IEventOption) => {
        isAdmin && dispatch(updateAuthEvent(value as IEventOption))

        isGuard && dispatch(updateLocationEvent(value as ILocation))

        navigate(0)
    }

    return (
        <Autocomplete
            value={defaultValue}
            onChange={(event, value) => handleChange(value || defaultValue)}
            fullWidth
            open={open}
            size="small"
            disableClearable
            onOpen={() => {
                setOpen(true);
            }}
            onClose={() => {
                setOpen(false);
            }}
            isOptionEqualToValue={(option, value) => option.name === value.name}
            getOptionLabel={(option) => option.name}
            options={options}
            loading={loading}
            PaperComponent={(paperProps) => <Paper {...paperProps} sx={{mt: 2}}/>}
            renderInput={(params) => (
                <TextField
                    {...params}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <InputAdornment position='end' sx={{mr: 4}}>
                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </InputAdornment>
                        ),
                    }}
                />
            )}
        />
    );
};

export default AutocompleteInput;