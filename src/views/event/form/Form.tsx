import React from 'react';
import {IEventRequest, IEventResponse} from "../../../models/IEvent";
import {useSnackbar} from "notistack";
import {useNavigate} from "react-router-dom";
import * as Yup from "yup";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import eventService from "../../../services/EventService";
import {Formik, FormikProps} from "formik";
import {Box, Button, Card, CardContent, Grid, TextField} from "@mui/material";

const Form: React.FC<{event?: IEventResponse}> = ({event}) => {
    const {enqueueSnackbar} = useSnackbar();
    const navigate = useNavigate();

    const initialValues: IEventRequest = {
        name: event?.name || '',
        fromDate: event?.fromDate || '',
        toDate: event?.toDate || '',
    }

    const validationSchema = Yup.object().shape({
        name: Yup.string().max(255),
        fromDate: Yup.string().max(255),
        toDate: Yup.string().max(255),
    })

    const handleAdd = async (values: IEventRequest, formActions: { [key: string]: any }) => {
        try {
            await eventService.postNewEvent(values)

            enqueueSnackbar('Успешно создан', {variant: 'success'});
            navigate(-1)
        }catch (error: any) {
            formActions.setStatus({success: false});
            formActions.setErrors({submit: error.message});
            formActions.setSubmitting(false);

            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        }
    }

    const handleUpdate = async (values: IEventRequest, formActions: { [key: string]: any }) => {
        values.id = event?.id!

        try {
            await eventService.putUpdateEvent(values)

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
                event ? await handleUpdate(values, {
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
            {(props: FormikProps<IEventRequest>) => (
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
                                        <Grid item>
                                            <TextField
                                                error={Boolean(props.touched.fromDate && props.errors.fromDate)}
                                                fullWidth
                                                helperText={props.touched.fromDate && props.errors.fromDate}
                                                label="Выберите дату"
                                                placeholder="Выберите дату"
                                                name="fromDate"
                                                type="date"
                                                onBlur={props.handleBlur}
                                                onChange={props.handleChange}
                                                required
                                                value={props.values.fromDate}
                                                variant="outlined"
                                                InputLabelProps={{shrink: true}}
                                            />
                                        </Grid>
                                        <Grid item>
                                            <TextField
                                                error={Boolean(props.touched.toDate && props.errors.toDate)}
                                                fullWidth
                                                helperText={props.touched.toDate && props.errors.toDate}
                                                label="Выберите дату"
                                                placeholder="Выберите дату"
                                                name="toDate"
                                                type="date"
                                                onBlur={props.handleBlur}
                                                onChange={props.handleChange}
                                                required
                                                value={props.values.toDate}
                                                variant="outlined"
                                                InputLabelProps={{shrink: true}}
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
                                    {event ? 'Сохранить' : 'Создать'}
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