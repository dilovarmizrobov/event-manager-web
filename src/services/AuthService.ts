import {IUser} from "../models/IUser";
import api from "../utils/api";
import {UserRolesEnum} from "../constants";

class AuthService {
    setAxiosInterceptors = (user: IUser | null, onLogout: VoidFunction) => {
        api.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response && error.response.status === 401) {
                    this.logout()
                    onLogout()
                }

                return Promise.reject(error);
            }
        )

        api.interceptors.request.use((config) => {
            if (user && user.role === UserRolesEnum.ADMIN) {
                if (config.params) {
                    config.params.eventId = user.eventId
                } else {
                    config.params = {eventId: user.eventId}
                }
            }

            if (user && user.role === UserRolesEnum.GUARD) {
                if (config.params) {
                    config.params.locationId = user.locationId
                } else {
                    config.params = {locationId: user.locationId}
                }
            }

            return config;
        }, (error) => {
            return Promise.reject(error);
        })
    }

    login = (username: string, password: string) => new Promise((resolve, reject) => {
        const params = new URLSearchParams()
        params.append('email', username)
        params.append('password', password)

        api.post('authenticate', params)
            .then((response) => {
                let data = response.data
                const user: IUser = {name: data.name, email: data.email, role: data.role}

                if (data.role === UserRolesEnum.ADMIN) {
                    user.events = data.events
                    user.eventId = data.events[0].id
                } else {
                    user.eventName = data.eventName
                }

                if (data.role === UserRolesEnum.GUARD) {
                    user.locations = data.locations
                    user.locationId = data.locations[0].id
                }

                this.setUserAndJwtInSession(response.data.jwt, user)

                resolve(user)
            })
            .catch(error => reject(error))
    })

    logout = () => {
        localStorage.removeItem('jwt');
        localStorage.removeItem('user');
        delete api.defaults.headers.common.Authorization;
    }

    setUserAndJwtInSession = (jwt: string, user: IUser) => {
        localStorage.setItem('jwt', jwt)
        localStorage.setItem('user', JSON.stringify(user))
        api.defaults.headers.common.Authorization = `Bearer ${jwt}`
    }

    setAxiosAuthorization = () => api.defaults.headers.common.Authorization = `Bearer ${this.getJwtFromSession()}`
    getJwtFromSession = () => localStorage.getItem('jwt')
    getUserFromSession = () => JSON.parse(localStorage.getItem('user') as string) as IUser;
    isAuthenticated = () => Boolean(this.getJwtFromSession())
}

const authService = new AuthService()

export default authService