import React, {useState} from 'react';
import { IBadgeRequest, IBadgeResponse} from "../../../models/IBadge";
import {useSnackbar} from "notistack";
import {useNavigate} from "react-router-dom";
import {pathBadgeImage} from "../../../utils/pathImages";
import * as Yup from "yup";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import {Formik, FormikProps} from "formik";
import {Avatar, Box, Button, Card, CardContent, Grid, TextField, Typography} from "@mui/material";
import badgeService from "../../../services/BadgeService";
import {AiOutlineFileWord} from "react-icons/ai";

const Form :React.FC<{badge? : IBadgeResponse}> = ({badge}) => {
    const {enqueueSnackbar} = useSnackbar();
    const navigate = useNavigate();
    const [fileName, setFileName] = useState<string>(badge?.fileName || "")
    const [uploadError, setUploadError] = useState<boolean>(false)

    const initialValues: IBadgeRequest = {
        name: badge?.name || "",
    }

    const validationSchema = Yup.object().shape({
        name: Yup.string().max(255),
    })

    const handleAdd = async (values: IBadgeRequest, formActions: { [key: string]: any }) => {
        if (!fileName) {
            setUploadError(true)
            return
        }

        try {
            await badgeService.postNewBadge(values)

            enqueueSnackbar('Успешно создан', {variant: 'success'});
            navigate(-1)
        } catch (error: any) {
            formActions.setStatus({success: false});
            formActions.setErrors({submit: error.message});
            formActions.setSubmitting(false);

            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        }
    }

    const handleUpdate = async (values: IBadgeRequest, formActions: { [key: string]: any }) => {
        values.id = badge?.id!

        if (!fileName) {
            setUploadError(true)
            return
        }

        try {
            await badgeService.putUpdateBadge(values)

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
                badge ? await handleUpdate(values, {
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
            {(props: FormikProps<IBadgeRequest>) => (
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
                                            <Typography variant="subtitle1" sx={{mb: 1}}>
                                                Выберите файл
                                            </Typography>
                                            <label>
                                                <Avatar
                                                    sx={{minWidth: 300, minHeight: 150, cursor: "pointer"}}
                                                    variant="rounded"
                                                >
                                                    <AiOutlineFileWord size={40}/>
                                                </Avatar>
                                                <input
                                                    accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                                    type="file"
                                                    style={{display: "none"}}
                                                    onChange={(e) => {
                                                        let file = (e.target as HTMLInputElement).files![0];
                                                        setFileName(file.name)
                                                        setUploadError(false)
                                                        props.setFieldValue("fileName", file);
                                                    }}
                                                />
                                            </label>
                                            {fileName && (
                                                <Typography variant="subtitle2" sx={{mt: 1}}>
                                                    {fileName}
                                                </Typography>
                                            )}
                                            {uploadError && (
                                                <Typography variant="subtitle2" sx={{color: "red", mt: 1}}>
                                                    Выберите файл
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
                                    {badge ? 'Сохранить' : 'Создать'}
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