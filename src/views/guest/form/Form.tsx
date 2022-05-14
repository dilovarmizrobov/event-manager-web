import React, {useState} from 'react';
import {IGuest} from "../../../models/IGuest";
import * as Yup from 'yup';
import {Formik, FormikProps} from 'formik';
import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Checkbox,
    Grid,
    MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TextField, Typography
} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {ICountryOption} from "../../../models/ICountry";
import {ILocation} from "../../../models/ILocation";
import guestService from "../../../services/GuestService";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import {useSnackbar} from "notistack";
import {FiCamera} from "react-icons/fi";
import {IBadgeOption} from "../../../models/IBadge";

const Form: React.FC<{guest?: IGuest, locations: ILocation[], countries: ICountryOption[], badges: IBadgeOption[]}> = (props) => {
    const {guest, locations: eventLocations, countries, badges} = props
    const navigate = useNavigate();
    const {enqueueSnackbar} = useSnackbar();
    const [locations, setLocations] = useState<number[]>((guest?.locations as number[]) || []);
    const [passportPreview, setPassportPreview] = useState<string>(guest?.passportImage as string);
    const [photoPreview, setPhotoPreview] = useState<string>(guest?.photo as string);
    const [uploadError, setUploadError] = useState<boolean>(false);
    const [locationError, setLocationError] = useState<boolean>(false);

    const initialValues: IGuest = {
        fullName: guest?.fullName || '',
        passport: guest?.passport || '',
        email: guest?.email || '',
        type: guest ? (guest.type as IBadgeOption).id : badges[0].id,
        countryId: guest?.countryId || countries[0].id,
        locations: locations,
    }

    const validationSchema = Yup.object().shape({
        fullName: Yup.string().max(255),
        passport: Yup.string().max(255),
        email: Yup.string().max(255),
    })

    const handleAdd = async (values: IGuest, formActions: { [key: string]: any }) => {
        try {
            values.locations = locations

            if (!passportPreview || !photoPreview) {
                setUploadError(true)
                return
            }

            if (values.locations.length === 0) {
                setLocationError(true)
                return
            }

            await guestService.postNewGuest(values)

            enqueueSnackbar('Успешно создан', {variant: 'success'});
            navigate(-1)
        } catch (error: any) {
            formActions.setStatus({success: false});
            formActions.setErrors({submit: error.message});
            formActions.setSubmitting(false);

            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        }
    }

    const handleUpdate = async (values: IGuest, formActions: { [key: string]: any }) => {
        values.id = guest?.id
        values.locations = locations

        try {
            if (!passportPreview || !photoPreview) {
                setUploadError(true)
                return
            }

            if (values.locations.length === 0) {
                setLocationError(true)
                return
            }

            await guestService.putUpdateGuest(values)

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

    const isLocation = (id: number) => locations.indexOf(id) !== -1;

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
                guest ? await handleUpdate(values, {
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
            {(props: FormikProps<IGuest>) => (
                <form onSubmit={props.handleSubmit}>
                    <Card>
                        <CardContent sx={{p: 3}}>
                            <Grid container spacing={4}>
                                <Grid item xs={12} lg={6}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12}>
                                            <TextField
                                                error={Boolean(props.touched.fullName && props.errors.fullName)}
                                                fullWidth
                                                autoFocus
                                                helperText={props.touched.fullName && props.errors.fullName}
                                                label="ФИО"
                                                placeholder="Введите фио"
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
                                                error={Boolean(props.touched.passport && props.errors.passport)}
                                                fullWidth
                                                helperText={props.touched.passport && props.errors.passport}
                                                label="Паспорт"
                                                placeholder="Введите номер паспорта"
                                                name="passport"
                                                onBlur={props.handleBlur}
                                                onChange={props.handleChange}
                                                required
                                                value={props.values.passport}
                                                variant="outlined"
                                                InputLabelProps={{shrink: true}}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                select
                                                error={Boolean(props.touched.countryId && props.errors.countryId)}
                                                fullWidth
                                                helperText={props.touched.countryId && props.errors.countryId}
                                                label="Страна"
                                                placeholder="Выберите Страну"
                                                name="countryId"
                                                onBlur={props.handleBlur}
                                                onChange={props.handleChange}
                                                required
                                                value={props.values.countryId}
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
                                                {
                                                    countries.map(item => (
                                                        <MenuItem key={item.id} value={item.id}>
                                                            {item.name}
                                                        </MenuItem>
                                                    ))
                                                }
                                            </TextField>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                error={Boolean(props.touched.email && props.errors.email)}
                                                fullWidth
                                                helperText={props.touched.email && props.errors.email}
                                                label="E-mail"
                                                placeholder="Введите электронную  почту"
                                                name="email"
                                                onBlur={props.handleBlur}
                                                onChange={props.handleChange}
                                                required
                                                value={props.values.email}
                                                variant="outlined"
                                                InputLabelProps={{shrink: true}}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                select
                                                error={Boolean(props.touched.type && props.errors.type)}
                                                fullWidth
                                                helperText={props.touched.type && props.errors.type}
                                                label="Тип"
                                                placeholder="Выберите тип"
                                                name="type"
                                                onBlur={props.handleBlur}
                                                onChange={props.handleChange}
                                                required
                                                value={props.values.type}
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
                                                {
                                                    badges.map(badge => (
                                                        <MenuItem key={badge.id} value={badge.id}>
                                                            {badge.name}
                                                        </MenuItem>
                                                    ))
                                                }
                                            </TextField>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} lg={6}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={6} lg={6}>
                                            <Typography variant="subtitle1" align="center" sx={{mb: 2}}>
                                                Копия паспорта
                                            </Typography>
                                            <label>
                                                <Avatar
                                                    src={passportPreview}
                                                    sx={{width: "100%", minHeight: "300px", cursor: "pointer"}}
                                                    variant="rounded"
                                                >
                                                    <FiCamera size={40}/>
                                                </Avatar>
                                                <input
                                                    accept="image/*"
                                                    type="file"
                                                    style={{display: "none"}}
                                                    onChange={(e) => {
                                                        let file = (e.target as HTMLInputElement).files![0];
                                                        setUploadError(false)
                                                        setPassportPreview(URL.createObjectURL(file))
                                                        props.setFieldValue("passportImage", file);
                                                    }}
                                                />
                                            </label>
                                        </Grid>
                                        <Grid item xs={6} lg={6}>
                                            <Typography variant="subtitle1" align="center" sx={{mb: 2}}>
                                                Фото
                                            </Typography>
                                            <label>
                                                <Avatar
                                                    src={photoPreview}
                                                    sx={{width: "100%", minHeight: "300px", cursor: "pointer"}}
                                                    variant="rounded"
                                                >
                                                    <FiCamera size={40}/>
                                                </Avatar>
                                                <input
                                                    accept="image/*"
                                                    type="file"
                                                    style={{display: "none"}}
                                                    onChange={(e) => {
                                                        let file = (e.target as HTMLInputElement).files![0];
                                                        setPhotoPreview(URL.createObjectURL(file))
                                                        setUploadError(false)
                                                        props.setFieldValue("photo", file);
                                                    }}
                                                />
                                            </label>
                                        </Grid>
                                        <Grid item xs={12}>
                                            {uploadError && (
                                                <Typography variant="subtitle2" align="center" sx={{color: "red"}}>
                                                    Выберите копию паспорта и фото
                                                </Typography>
                                            )}
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} lg={6}>
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
                                                    eventLocations.map((item) => {
                                                        const isPlaceLocated = isLocation(item.id!);

                                                        return(
                                                            <TableRow hover key={item.id} onClick={() => handleChangeLocation(item.id!)}>
                                                                <TableCell padding="checkbox">
                                                                    <Checkbox
                                                                        color="primary"
                                                                        checked={isPlaceLocated}
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
                                    {guest ? 'Сохранить' : 'Создать'}
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