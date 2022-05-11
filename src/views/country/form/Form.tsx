import React, {useState} from 'react';
import {ICountryRequest, ICountryResponse} from "../../../models/ICountry";
import {useSnackbar} from "notistack";
import {useNavigate} from "react-router-dom";
import * as Yup from "yup";
import {Formik, FormikProps} from "formik";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import countryService from "../../../services/CountryService";
import {Avatar, Box, Button, Card, CardContent, Grid, TextField, Typography} from "@mui/material";
import {FiCamera} from "react-icons/fi";

const Form : React.FC<{country?: ICountryResponse}> = ({country}) => {
    const {enqueueSnackbar} = useSnackbar();
    const navigate = useNavigate();
    const [photoPreview, setPhotoPreview] = useState<string>(country?.flag || "")
    const [uploadError, setUploadError] = useState<boolean>(false)

    const initialValues: ICountryRequest = {
        name: country?.name || "",
        abbr: country?.abbr || "",
    }

    const validationSchema = Yup.object().shape({
        name: Yup.string().max(255),
        abbr: Yup.string().max(255),
    })

    const handleAdd = async (values: ICountryRequest, formActions: { [key: string]: any }) => {
        try {
            if (!photoPreview) {
                setUploadError(true)
                return
            }

            await countryService.postNewCountry(values)

            enqueueSnackbar('Успешно создан', {variant: 'success'});
            navigate(-1)
        } catch (error: any) {
            formActions.setStatus({success: false});
            formActions.setErrors({submit: error.message});
            formActions.setSubmitting(false);

            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        }
    }

    const handleUpdate = async (values: ICountryRequest, formActions: { [key: string]: any }) => {
        values.id = country?.id!

        if (!photoPreview) {
            setUploadError(true)
            return
        }

        try {
            await countryService.putUpdateCountry(values)

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
                country ? await handleUpdate(values, {
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
            {(props: FormikProps<ICountryRequest>) => (
                <form onSubmit={props.handleSubmit}>
                    <Card>
                        <CardContent sx={{p:3}}>
                            <Grid container>
                                <Grid item xs={12} md={6}>
                                    <Grid container spacing={4}>
                                        <Grid item xs={12}>
                                            <TextField
                                                error={Boolean(props.touched.name && props.errors.name)}
                                                fullWidth
                                                autoFocus
                                                helperText={props.touched.name && props.errors.name}
                                                label="Введите название"
                                                placeholder="Введите название"
                                                name="name"
                                                onBlur={props.handleBlur}
                                                onChange={props.handleChange}
                                                required
                                                value={props.values.name}
                                                variant="outlined"
                                                InputLabelProps={{shrink: true}}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                error={Boolean(props.touched.abbr && props.errors.abbr)}
                                                fullWidth
                                                helperText={props.touched.abbr && props.errors.abbr}
                                                label="аббревиатуру "
                                                placeholder="Введите аббревиатуру "
                                                name="abbr"
                                                onBlur={props.handleBlur}
                                                onChange={props.handleChange}
                                                required
                                                value={props.values.abbr}
                                                variant="outlined"
                                                InputLabelProps={{shrink: true}}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant="subtitle1" sx={{mb: 1}}>
                                                Выберите флаг
                                            </Typography>
                                            <label>
                                                <Avatar
                                                    src={photoPreview}
                                                    sx={{minWidth: "400px", minHeight: "250px", cursor: "pointer"}}
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
                                                        props.setFieldValue("flag", file);
                                                    }}
                                                />
                                            </label>
                                            {uploadError && (
                                                <Typography variant="subtitle2" sx={{color: "red", mt: 1}}>
                                                    Выберите флаг
                                                </Typography>
                                            )}
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
                                    {country ? 'Сохранить' : 'Создать'}
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
