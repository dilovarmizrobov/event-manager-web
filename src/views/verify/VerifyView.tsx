import React from 'react';
import {useAppDispatch, useAppSelector} from "../../store/hooks";
import {selectAuth, updateVerify} from "../../store/reducers/authSlice";
import {Navigate, useNavigate} from "react-router-dom";
import Page from "../../components/Page";
import {styled} from "@mui/material/styles";
import {Box, Button, Card, CardContent, CircularProgress, Container, TextField, Typography} from "@mui/material";
import * as Yup from "yup";
import authService from "../../services/AuthService";
import {Formik, FormikProps} from "formik";
import {useSnackbar} from "notistack";
import errorMessageHandler from "../../utils/errorMessageHandler";

const Root = styled('div')(({ theme }) => ({
    justifyContent: 'center',
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    height: '100%',
    minHeight: '100%',
    flexDirection: 'column',
    paddingBottom: 80,
    paddingTop: 80
}))

const StyledCard = styled(Card)(() => ({
    overflow: 'visible',
    display: 'flex',
    position: 'relative',
    '& > *': {
        flexGrow: 1,
        flexBasis: '50%',
        width: '50%'
    }
}))

const StyledCardContent = styled(CardContent)(({theme}) => ({
    padding: theme.spacing(4)
}))

const StyledCircularProgress = styled(CircularProgress)(() => ({
    color: "secondary",
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
}))

interface IFormInput {
    password: string;
    passwordConfirmation: string;
}

const passwordValidationSchema = Yup.object().shape({
    password: Yup.string().max(255),
    passwordConfirmation: Yup.string().max(255).oneOf([Yup.ref('password'), null], 'Ваш новый пароль и подтверждение пароля не совпадают')
});

const VerifyView = () => {
    const {enqueueSnackbar} = useSnackbar();
    const navigate = useNavigate()
    const {user} = useAppSelector(selectAuth)
    const dispatch = useAppDispatch()

    if (user!.verify) {
        return <Navigate to="/" />;
    }

    return (
        <>
            <Page title="Измение пароля"/>
            <Root>
                <Container maxWidth="sm">
                    <StyledCard>
                        <StyledCardContent>
                            <Typography variant="h5" color="textPrimary" align="center" mb={2}>
                                Измение пароля
                            </Typography>
                            <Formik
                                initialValues={{password: '', passwordConfirmation: ''}}
                                validationSchema={passwordValidationSchema}
                                onSubmit={async (values, {setStatus, setSubmitting}) => {
                                    setSubmitting(true)

                                    try {
                                        await authService.verify(values.password, values.passwordConfirmation)
                                        dispatch(updateVerify(true))
                                        enqueueSnackbar('Успешно изменено', {variant: 'success'});
                                        navigate('/')
                                    } catch (error: any) {
                                        setStatus({ success: false });
                                        setSubmitting(false);
                                        enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
                                    }
                                }}
                            >
                                {(props: FormikProps<IFormInput>) => (
                                    <form onSubmit={props.handleSubmit}>
                                        <TextField
                                            error={Boolean(props.touched.password && props.errors.password)}
                                            fullWidth
                                            helperText={props.touched.password && props.errors.password}
                                            label="Введите новый пароль"
                                            margin="normal"
                                            name="password"
                                            autoComplete="on"
                                            onBlur={props.handleBlur}
                                            onChange={props.handleChange}
                                            type="password"
                                            value={props.values.password}
                                            variant="outlined"
                                            required
                                        />
                                        <TextField
                                            error={Boolean(props.touched.passwordConfirmation && props.errors.passwordConfirmation)}
                                            fullWidth
                                            helperText={props.touched.passwordConfirmation && props.errors.passwordConfirmation}
                                            label="Подтвредите новый пароль"
                                            margin="normal"
                                            name="passwordConfirmation"
                                            autoComplete="on"
                                            onBlur={props.handleBlur}
                                            onChange={props.handleChange}
                                            type="password"
                                            value={props.values.passwordConfirmation}
                                            variant="outlined"
                                            required
                                        />
                                        <Box mt={2} sx={{position: 'relative'}}>
                                            <Button
                                                color="secondary"
                                                disabled={props.isSubmitting}
                                                fullWidth
                                                size="large"
                                                type="submit"
                                                variant="contained"
                                            >
                                                Сохранить
                                            </Button>
                                            {props.isSubmitting && (<StyledCircularProgress size={24} />)}
                                        </Box>
                                    </form>
                                )}
                            </Formik>
                        </StyledCardContent>
                    </StyledCard>
                </Container>
            </Root>
        </>
    );
};

export default VerifyView;