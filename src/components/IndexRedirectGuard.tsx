import React from "react";
import {useAppSelector} from "../store/hooks";
import {selectAuth} from "../store/reducers/authSlice";
import {Navigate, useLocation} from "react-router-dom";
import {UserRolesEnum} from "../constants";

const IndexRedirectGuard: React.FC = () => {
    const {isAuthenticated, user} = useAppSelector(selectAuth)
    let location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (user?.role === UserRolesEnum.ADMIN) {
        return <Navigate to="/events" state={{ from: location }} replace />;
    } else {
        return <Navigate to="/home" state={{ from: location }} replace />;
    }
}

export default IndexRedirectGuard