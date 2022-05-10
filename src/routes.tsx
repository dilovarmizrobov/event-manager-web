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
import hasPermission from "./utils/hasPermisson";
import {UserRolesEnum} from "./constants";
import PERMISSIONS from "./constants/permissions";

interface CustomRouteObject extends RouteObject {
    perm?: UserRolesEnum[],
    children?: CustomRouteObject[];
}

const routes: CustomRouteObject[] = [
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
                        perm: PERMISSIONS.CREATE.GUEST,
                        element: <GuestCreateView />
                    },
                    {
                        path: '/guests/:guestId/edit',
                        perm: PERMISSIONS.EDIT.GUEST,
                        element: <GuestEditView />
                    },
                    {
                        path: '/event-locations',
                        perm: PERMISSIONS.LIST.EVENT_LOCATION,
                        element: <EventLocationListView />
                    },
                    {
                        path: '/event-locations/create',
                        perm: PERMISSIONS.CREATE.EVENT_LOCATION,
                        element: <EventLocationCreateView />
                    },
                    {
                        path: '/event-locations/:locationId/edit',
                        perm: PERMISSIONS.EDIT.EVENT_LOCATION,
                        element: <EventLocationEditView />
                    },
                    {
                        path: '/events',
                        perm: PERMISSIONS.LIST.EVENT,
                        element: <EventListView />
                    },
                    {
                        path: '/events/create',
                        perm: PERMISSIONS.CREATE.EVENT,
                        element: <EventCreateView />
                    },
                    {
                        path: '/events/:eventId/edit',
                        perm: PERMISSIONS.EDIT.EVENT,
                        element: <EventEditView />
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

const filterRoutes = (routes: CustomRouteObject[]) => {
    return routes.filter((route) => {
        if (route.children) {
            route.children = filterRoutes(route.children)
            return true
        } else {
            if (route.perm) return hasPermission(route.perm)
            else return true
        }
    })
}

const Routes: React.FC = () => {
    return useRoutes(routes)
}

export default Routes;