import React from 'react';
import {ILocation} from "../../../models/ILocation";
import {useSnackbar} from "notistack";
import {Formik, FormikProps} from "formik";
import * as Yup from "yup";
import {Box, Button, Card, CardContent, TextField} from "@mui/material";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import {useNavigate} from "react-router-dom";
import eventLocationService from "../../../services/EventLocationService";

const Form: React.FC<{ location?: ILocation }> = ({location}) => {
    const {enqueueSnackbar} = useSnackbar();
    const navigate = useNavigate();

    const initialValues: ILocation = {
        name: location?.name || '',
    }

    const validationSchema = Yup.object().shape({
        name: Yup.string().max(255),
    })

    const handleAdd = async (values: ILocation, formActions: { [key: string]: any }) => {
        try {
            await eventLocationService.postNewLocation(values)

            enqueueSnackbar('Успешно создан', {variant: 'success'});
            navigate(-1)
        } catch (error: any) {
            formActions.setStatus({success: false});
            formActions.setErrors({submit: error.message});
            formActions.setSubmitting(false);

            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        }
    }

    const handleUpdate = async (values: ILocation, formActions: { [key: string]: any }) => {
        values.id = location?.id!

        try {
            await eventLocationService.putUpdateLocation(values)

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
                location ? await handleUpdate(values, {
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
            {(props: FormikProps<ILocation>) => (
                <form onSubmit={props.handleSubmit}>
                   <Card>
                       <CardContent sx={{p:3}}>
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
                                   {location ? 'Сохранить' : 'Создать'}
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