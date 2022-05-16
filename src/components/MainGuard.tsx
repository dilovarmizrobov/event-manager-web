import React, {useEffect} from 'react';
import {Navigate, Outlet} from "react-router-dom";
import {useAppSelector} from "../store/hooks";
import {selectAuth} from "../store/reducers/authSlice";
import {UserRolesEnum} from "../constants";
import {useSnackbar} from "notistack";

const MainGuard = () => {
    const {enqueueSnackbar} = useSnackbar();
    const auth = useAppSelector(selectAuth)

    useEffect(() => {
        if (auth.user!.role === UserRolesEnum.ADMIN && !auth.user!.event) {
            enqueueSnackbar('Выберите с начала мероприятия', {variant: 'info'})
        }
    }, [])

    if (auth.user!.role === UserRolesEnum.ADMIN && !auth.user!.event) {
        return <Navigate to="/events" replace={true} />;
    }

    return <Outlet />
};

export default MainGuard;