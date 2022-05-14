import React, {useState} from 'react';
import {IUserRequest, IUserResponse} from "../../../models/IUser";
import {ILocation} from "../../../models/ILocation";
import {useSnackbar} from "notistack";
import {useNavigate} from "react-router-dom";
import {UserRolesEnum, UserRolesMap} from "../../../constants";
import * as Yup from "yup";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import {Formik, FormikProps} from "formik";
import {
    Box,
    Button,
    Card,
    CardContent,
    Checkbox,
    Grid, MenuItem,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from "@mui/material";
import userService from "../../../services/UserService";
import {useAppSelector} from "../../../store/hooks";
import {selectAuth} from "../../../store/reducers/authSlice";

const Form :React.FC<{user?: IUserResponse, locations : ILocation[]}> = (props) => {
    const {user, locations: eventLocations} = props;
    const auth = useAppSelector(selectAuth)
    const isAdmin = auth.user!.role === UserRolesEnum.ADMIN
    const {enqueueSnackbar} = useSnackbar();
    const navigate = useNavigate();
    const [locations, setLocations] = useState<number[]>(user?.locations?.map(item => item.id!) || [])
    const [locationError, setLocationError] = useState<boolean>(false);

    const initialValues: IUserRequest = {
        fullName: user?.fullName || '',
        email: user?.email || '',
        phoneNumber: user?.phoneNumber || '',
        role: user?.role || (isAdmin ? UserRolesEnum.ADMIN_EVENT : UserRolesEnum.EMPLOYEE)
    }

    const validationSchema = Yup.object().shape({
        fullName: Yup.string().max(255),
        email: Yup.string().max(255),
        phoneNumber: Yup.string().max(255),
    })

    const handleAdd = async (values: IUserRequest, formActions: { [key: string]: any }) => {
        try {
            if (values.role === UserRolesEnum.GUARD) {
                if (locations.length === 0) {
                    setLocationError(true)
                    return
                }

                values.locations = locations
            }

            await userService.postNewUser(values)

            enqueueSnackbar('Успешно создан', {variant: 'success'});
            navigate(-1)
        } catch (error: any) {
            formActions.setStatus({success: false});
            formActions.setErrors({submit: error.message});
            formActions.setSubmitting(false);

            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        }
    }

    const handleUpdate = async (values: IUserRequest, formActions: { [key: string]: any }) => {
        try {
            if (values.role === UserRolesEnum.GUARD) {
                if (locations.length === 0) {
                    setLocationError(true)
                    return
                }

                values.locations = locations
            }

            values.id = user?.id

            await userService.putUpdateUser(values)

            enqueueSnackbar('Успешно обновлен', {variant: 'success'});
            navigate(-1)
        } catch (error: any) {
            formActions.setStatus({success: false});
            formActions.setErrors({submit: error.message});
            formActions.setSubmitting(false);

            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        }
    }

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            let newState = eventLocations.map((n) => n.id!);
            setLocationError(false)
            setLocations(newState);
            return;
        }

        setLocationError(true)
        setLocations([]);
    };

    const handleChangeLocation = (id: number) => {
        let newState = [...locations]
        let index = newState.findIndex(item => item === id)

        index > -1 ? newState.splice(index, 1) : newState.push(id)

        setLocationError(newState.length === 0)
        setLocations(newState);
    };

    const isLocations = (id: number) => locations.indexOf(id) !== -1;

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={async (values, {
                resetForm,
                setErrors,
                setStatus,
                setSubmitting
            }) => {
                setSubmitting(true)
                user ? await handleUpdate(values, {
                    resetForm,
                    setErrors,
                    setStatus,
                    setSubmitting
                }) : await handleAdd(values, {
                    resetForm,
                    setErrors,
                    setStatus,
                    setSubmitting
                })
            }}
        >
            {(props: FormikProps<IUserRequest>) => (
                <form onSubmit={props.handleSubmit}>
                    <Card>
                        <CardContent sx={{p:3}}>
                            <Grid container>
                                <Grid item xs={12} lg={6}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12}>
                                            <TextField
                                                error={Boolean(props.touched.fullName && props.errors.fullName)}
                                                fullWidth
                                                autoFocus
                                                helperText={props.touched.fullName && props.errors.fullName}
                                                label="ФИО"
                                                placeholder="Введите ФИО"
                                                name="fullName"
                                                onBlur={props.handleBlur}
                                                onChange={props.handleChange}
                                                required
                                                value={props.values.fullName}
                                                variant="outlined"
                                                InputLabelProps={{shrink: true}}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                select
                                                error={Boolean(props.touched.role && props.errors.role)}
                                                fullWidth
                                                helperText={props.touched.role && props.errors.role}
                                                label="Должность"
                                                name="role"
                                                onBlur={props.handleBlur}
                                                onChange={props.handleChange}
                                                required
                                                value={props.values.role}
                                                variant="outlined"
                                                InputLabelProps={{shrink: true}}
                                                SelectProps={{
                                                    MenuProps: {
                                                        variant: "selectedMenu",
                                                        anchorOrigin: {
                                                            vertical: "bottom",
                                                            horizontal: "left"
                                                        },
                                                        transformOrigin: {
                                                            vertical: "top",
                                                            horizontal: "left"
                                                        },
                                                    }
                                                }}
                                            >
                                                {Object.keys(UserRolesEnum)
                                                    .filter(item => {
                                                        switch (item as UserRolesEnum) {
                                                            case UserRolesEnum.ADMIN:
                                                                return isAdmin
                                                            default: return true
                                                        }
                                                    })
                                                    .map(item => (
                                                        <MenuItem key={item} value={item}>
                                                            {UserRolesMap.get(item as UserRolesEnum)}
                                                        </MenuItem>
                                                    ))
                                                }
                                            </TextField>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                error={Boolean(props.touched.phoneNumber && props.errors.phoneNumber)}
                                                fullWidth
                                                helperText={props.touched.phoneNumber && props.errors.phoneNumber}
                                                label="Телефон (логин)"
                                                placeholder="Введите телефон"
                                                name="phoneNumber"
                                                onBlur={props.handleBlur}
                                                onChange={props.handleChange}
                                                required
                                                value={props.values.phoneNumber}
                                                variant="outlined"
                                                InputLabelProps={{shrink: true}}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                error={Boolean(props.touched.email && props.errors.email)}
                                                fullWidth
                                                helperText={props.touched.email && props.errors.email}
                                                label="Email"
                                                placeholder="Введите Email"
                                                name="email"
                                                onBlur={props.handleBlur}
                                                onChange={props.handleChange}
                                                required
                                                value={props.values.email}
                                                variant="outlined"
                                                InputLabelProps={{shrink: true}}
                                            />
                                        </Grid>
                                        {
                                            props.values.role === UserRolesEnum.GUARD && (
                                                <Grid item xs={12}>
                                                    <TableContainer>
                                                        <Table>
                                                            <TableHead>
                                                                <TableRow>
                                                                    <TableCell padding="checkbox">
                                                                        <Checkbox
                                                                            color="primary"
                                                                            indeterminate={locations.length > 0 && locations.length < eventLocations.length}
                                                                            checked={locations.length > 0 && locations.length === eventLocations.length}
                                                                            onChange={handleSelectAllClick}
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell>Все</TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {
                                                                    eventLocations.map((item) =>{
                                                                        const isPlaced = isLocations(item.id!);

                                                                        return(
                                                                            <TableRow hover key={item.id} onClick={() => handleChangeLocation(item.id!)}>
                                                                                <TableCell padding="checkbox">
                                                                                    <Checkbox
                                                                                        color="primary"
                                                                                        checked={isPlaced}
                                                                                    />
                                                                                </TableCell>
                                                                                <TableCell component="th" scope="row">
                                                                                    {item.name}
                                                                                </TableCell>
                                                                            </TableRow>
                                                                        )
                                                                    })
                                                                }
                                                            </TableBody>
                                                        </Table>
                                                    </TableContainer>
                                                    {locationError && (
                                                        <Typography variant="subtitle2" sx={{mt: 2, ml: 2, color: "red"}}>
                                                            Выберите место проведения
                                                        </Typography>
                                                    )}
                                                </Grid>
                                            )
                                        }
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Box sx={{mb: 3, mt: 4, float: 'right'}}>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    type="button"
                                    disabled={props.isSubmitting}
                                    onClick={() => navigate(-1)}
                                    sx={{marginRight: 2, width: 177}}
                                >
                                    Отмена
                                </Button>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    type="submit"
                                    disabled={props.isSubmitting}
                                    sx={{width: 177}}
                                >
                                    {user ? 'Сохранить' : 'Создать'}
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </form>
            )}
        </Formik>
    );
};

export default Form;