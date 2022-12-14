import React, {useState} from 'react';
import { IBadgeRequest, IBadgeResponse} from "../../../models/IBadge";
import {useSnackbar} from "notistack";
import {useNavigate} from "react-router-dom";
import * as Yup from "yup";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import {Formik, FormikProps} from "formik";
import {
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    IconButton,
    Table, TableBody, TableCell, TableContainer, TableRow,
    TextField,
    Typography
} from "@mui/material";
import badgeService from "../../../services/BadgeService";
import {VscFiles} from "react-icons/vsc";
import {FiTrash} from "react-icons/fi";

const Form :React.FC<{badge? : IBadgeResponse}> = ({badge}) => {
    const {enqueueSnackbar} = useSnackbar();
    const navigate = useNavigate();
    const [uploadError, setUploadError] = useState(false)

    const initialValues: IBadgeRequest = {
        name: badge?.name || "",
    }

    const validationSchema = Yup.object().shape({
        name: Yup.string().max(255),
    })

    const handleAdd = async (values: IBadgeRequest, formActions: { [key: string]: any }) => {
        if (!values.files) {
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
                                                Выберите файлы
                                            </Typography>
                                            <Box sx={{border: '1px solid black', borderRadius: 1, borderColor: '#0000003b'}} p={2}>
                                                <TableContainer>
                                                    <Table size="small">
                                                        <TableBody>
                                                            {
                                                                props.values.files && props.values.files.map((file, index) => (
                                                                    <TableRow hover key={index}>
                                                                        <TableCell>{file.name}</TableCell>
                                                                        <TableCell align="right">
                                                                            <IconButton onClick={() => {
                                                                                let newFiles = [...props.values.files!]

                                                                                newFiles.splice(index, 1)

                                                                                props.setFieldValue("files", newFiles);
                                                                            }}>
                                                                                <FiTrash size={20}/>
                                                                            </IconButton>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ))
                                                            }
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                                <Grid container justifyContent="flex-end" mt={3}>
                                                    <label style={{display: 'inline-block'}}>
                                                        <input
                                                            type="file"
                                                            multiple
                                                            style={{display: "none"}}
                                                            onChange={(e) => {
                                                                let uploadFiles = Array.from((e.target as HTMLInputElement).files!);
                                                                let newFiles = [...(props.values.files || [])]
                                                                uploadFiles = uploadFiles.filter(file => !newFiles.find(item=> item.name === file.name))
                                                                setUploadError(false)
                                                                props.setFieldValue("files", [...newFiles, ...uploadFiles]);

                                                                (e.target as HTMLInputElement).value = ''
                                                            }}
                                                        />
                                                        <Button variant="outlined" startIcon={<VscFiles />} component="span">
                                                            Выбрать
                                                        </Button>
                                                    </label>
                                                </Grid>
                                            </Box>
                                            {uploadError && (
                                                <Typography variant="subtitle2" sx={{color: "red", mt: 1}}>
                                                    Выберите файлы
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