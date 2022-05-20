import React from 'react';
import {IUserRequest, IUserResponse} from "../../../../models/IUser";
import {useSnackbar} from "notistack";
import {useNavigate} from "react-router-dom";
import {UserRolesEnum, UserRolesMap} from "../../../../constants";
import * as Yup from "yup";
import errorMessageHandler from "../../../../utils/errorMessageHandler";
import {Formik, FormikProps} from "formik";
import {
    Box,
    Button,
    Card,
    CardContent,
    Grid, MenuItem,
    TextField
} from "@mui/material";
import userService from "../../../../services/UserService";

const Form: React.FC<{user?: IUserResponse}> = ({user}) => {
    const {enqueueSnackbar} = useSnackbar();
    const navigate = useNavigate();

    const initialValues: IUserRequest = {
        fullName: user?.fullName || '',
        email: user?.email || '',
        phoneNumber: user?.phoneNumber || '',
        role: user?.role || UserRolesEnum.ADMIN,
        password: ''
    }

    const validationSchema = Yup.object().shape({
        fullName: Yup.string().max(255),
        email: Yup.string().email(),
        phoneNumber: Yup.string().max(255),
        password: Yup.string().max(255),
    })

    const handleAdd = async (values: IUserRequest, formActions: { [key: string]: any }) => {
        try {
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
                                                <MenuItem value={UserRolesEnum.ADMIN}>
                                                    {UserRolesMap.get(UserRolesEnum.ADMIN)}
                                                </MenuItem>
                                            </TextField>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                error={Boolean(props.touched.phoneNumber && props.errors.phoneNumber)}
                                                fullWidth
                                                helperText={props.touched.phoneNumber && props.errors.phoneNumber}
                                                label="Телефон"
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
                                                label="Email (логин)"
                                                placeholder="Введите Email"
                                                name="email"
                                                onBlur={props.handleBlur}
                                                onChange={props.handleChange}
                                                required
                                                value={props.values.email}
                                                variant="outlined"
                                                InputLabelProps={{shrink: true}}
                                                type="email"
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                error={Boolean(props.touched.password && props.errors.password)}
                                                fullWidth
                                                helperText={props.touched.password && props.errors.password}
                                                label="Пароль"
                                                placeholder="Введите пароль"
                                                name="password"
                                                onBlur={props.handleBlur}
                                                onChange={props.handleChange}
                                                value={props.values.password}
                                                variant="outlined"
                                                InputLabelProps={{shrink: true}}
                                                type="password"
                                            />
                                        </Grid>
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