import React, {useEffect} from "react";
import authService from "../services/AuthService";
import {logout, selectAuth} from "../store/reducers/authSlice";
import {useAppDispatch, useAppSelector} from "../store/hooks";

const Auth: React.FC = () => {
    const dispatch = useAppDispatch()
    const {user} = useAppSelector(selectAuth)

    useEffect(() => {
        authService.setAxiosInterceptors(user, () => dispatch(logout()))
    }, [dispatch, user])

    return <></>
}

export default Auth