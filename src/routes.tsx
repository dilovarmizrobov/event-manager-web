import React from "react";
import {RouteObject, useRoutes} from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
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
import UsersListView from "./views/users/list/UsersListView";
import CountryListView from "./views/country/list/CountryListView";
import CountryCreateView from "./views/country/form/CountryCreateView";
import CountryEditView from "./views/country/form/CountryEditView";
import UserCreateView from "./views/users/form/UserCreateView";
import UserEditView from "./views/users/form/UserEditView";
import BadgeListView from "./views/badge/list/BadgeListView";
import BadgeCreateView from "./views/badge/form/BadgeCreateView";
import BadgeEditView from "./views/badge/form/BadgeEditView";
import AdminLayout from "./layouts/AdminLayout";
import IndexRedirectGuard from "./components/IndexRedirectGuard"
import Home from "./views/Home";

interface CustomRouteObject extends RouteObject {
    perm?: UserRolesEnum[],
    children?: CustomRouteObject[];
}

const routes: CustomRouteObject[] = [
    {
        path: '/',
        element: <IndexRedirectGuard />,
    },
    {
        path: '/login',
        element: <LoginView />
    },
    {
        element: <AuthGuard />,
        children: [
            {
              element: <AdminLayout />,
              children: [
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
              ]
            },
            {
                element: <MainLayout />,
                children: [
                    {
                      path: '/home',
                      element: <Home />
                    },
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
                        path: '/users',
                        perm: PERMISSIONS.LIST.USER,
                        element: <UsersListView />
                    },
                    {
                        path: '/users/create',
                        perm: PERMISSIONS.CREATE.USER,
                        element: <UserCreateView />
                    },
                    {
                        path: '/users/:userId/edit',
                        perm: PERMISSIONS.EDIT.USER,
                        element: <UserEditView />
                    },
                    {
                        path: '/countries',
                        perm: PERMISSIONS.LIST.COUNTRY,
                        element: <CountryListView />
                    },
                    {
                        path: '/countries/create',
                        perm: PERMISSIONS.CREATE.COUNTRY,
                        element: <CountryCreateView />
                    },
                    {
                        path: '/countries/:countryId/edit',
                        perm: PERMISSIONS.EDIT.COUNTRY,
                        element: <CountryEditView />
                    },
                    {
                        path: '/badge-templates',
                        perm: PERMISSIONS.LIST.BADGE,
                        element: <BadgeListView />
                    },
                    {
                        path: '/badge-templates/create',
                        perm: PERMISSIONS.CREATE.BADGE,
                        element: <BadgeCreateView />
                    },
                    {
                        path: '/badge-templates/:badgeId/edit',
                        perm: PERMISSIONS.EDIT.BADGE,
                        element: <BadgeEditView />
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
    return useRoutes(filterRoutes(routes))
}

export default Routes;