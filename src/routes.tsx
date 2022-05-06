import React from "react";
import {Navigate, RouteObject, useRoutes} from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./views/HomePage";
import Error404 from "./views/Error404";
import LoginView from "./views/auth/LoginView";
import AuthGuard from "./components/AuthGuard";
import GuestListView from "./views/guest/list/GuestListView";
import GuestCreateView from "./views/guest/form/GuestCreateView";
import GuestEditView from "./views/guest/form/GuestEditView";

const routes: RouteObject[] = [
    {
        path: '/',
        element: <Navigate to="/home" replace />,
    },
    {
        path: '/login',
        element: <LoginView />
    },
    {
        element: <AuthGuard />,
        children: [
            {
                element: <MainLayout />,
                children: [
                    {
                        path: '/guests',
                        element: <GuestListView />
                    },
                    {
                        path: '/guests/create',
                        element: <GuestCreateView />
                    },
                    {
                        path: '/guests/edit',
                        element: <GuestEditView />
                    },
                    {
                        path: '/home',
                        element: <HomePage />
                    },
                ]
            }
        ]
    },
    {
        path: '*',
        element: <Error404 />
    },
]

const Routes: React.FC = () => {
    return useRoutes(routes)
}

export default Routes;