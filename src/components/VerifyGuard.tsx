import React from 'react';
import {Navigate, Outlet} from "react-router-dom";
import {useAppSelector} from "../store/hooks";
import {selectAuth} from "../store/reducers/authSlice";

const VerifyGuard = () => {
    const {user} = useAppSelector(selectAuth)

    if (!user!.verify) {
        return <Navigate to="/verify" replace={true} />;
    }

    return <Outlet />
};

export default VerifyGuard;