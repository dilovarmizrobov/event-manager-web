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
import EventLocationListView from "./views/event-location/list/EventLocationListView";
import EventLocationCreateView from "./views/event-location/form/EventLocationCreateView";
import EventLocationEditView from "./views/event-location/form/EventLocationEditView";
import EventListView from "./views/event/list/EventListView";
import EventCreateView from "./views/event/form/EventCreateView";
import EventEditView from "./views/event/form/EventEditView";
import UsersListView from "./views/users/list/UsersListView";
import CountryListView from "./views/country/list/CountryListView";
import CountryCreateView from "./views/country/form/CountryCreateView";
import CountryEditView from "./views/country/form/CountryEditView";

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
                        path: '/guests/:guestId/edit',
                        element: <GuestEditView />
                    },
                    {
                        path: '/event-locations',
                        element: <EventLocationListView />
                    },
                    {
                        path: '/event-locations/create',
                        element: <EventLocationCreateView />
                    },
                    {
                        path: '/event-locations/:locationId/edit',
                        element: <EventLocationEditView />
                    },
                    {
                        path: '/events',
                        element: <EventListView />
                    },
                    {
                        path: '/events/create',
                        element: <EventCreateView />
                    },
                    {
                        path: '/events/:eventId/edit',
                        element: <EventEditView />
                    },
                    {
                        path: '/users',
                        element: <UsersListView />
                    },
                    {
                        path: '/countries',
                        element: <CountryListView />
                    },
                    {
                        path: '/countries/create',
                        element: <CountryCreateView />
                    },
                    {
                        path: '/countries/:countryId/edit',
                        element: <CountryEditView />
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