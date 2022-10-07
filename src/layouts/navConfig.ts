import {FaBlogger, FaUserFriends, FaUsers} from "react-icons/fa";
import {IoFlag, IoLocationSharp} from "react-icons/io5";
import PERMISSIONS from "../constants/permissions";
import {BsPersonBadge} from "react-icons/bs";
import {IconType} from "react-icons";
import {UserRolesEnum} from "../constants";
import {MdDashboard} from "react-icons/md";

export interface INavItem {
    title: string;
    icon: IconType;
    href: string;
    perm?: UserRolesEnum[];
}

export interface INavConfig {
    subheader: string;
    items: INavItem[]
}

export const navConfigMain: INavConfig[] = [
    {
        subheader: 'Главная',
        items: [
            {
                title: 'Дашборд',
                icon: MdDashboard,
                href: '/dashboards',
                perm: PERMISSIONS.LIST.DASHBOARD,
            },
            {
                title: 'Гости',
                icon: FaUsers,
                href: '/guests',
            },
            {
                title: 'Логирование',
                icon: FaBlogger,
                href: '/loggers',
            },
            {
                title: 'Места проведения',
                icon: IoLocationSharp,
                href: '/event-locations',
                perm: PERMISSIONS.LIST.EVENT_LOCATION,
            },
            {
                title: 'Пользователи',
                icon: FaUserFriends,
                href: '/users',
                perm: PERMISSIONS.LIST.USER,
            },
            {
                title: 'Страны',
                icon: IoFlag,
                href: '/countries',
                perm: PERMISSIONS.LIST.COUNTRY,
            },
            {
                title: 'Шаблоны бейджей',
                icon: BsPersonBadge,
                href: '/badge-templates',
                perm: PERMISSIONS.LIST.BADGE,
            },
        ]
    },
]
