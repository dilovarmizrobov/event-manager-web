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

        return api.interceptors.request.use((config) => {
            if (user && user.role === UserRolesEnum.ADMIN) {
                if (config.params) {
                    config.params.eventId = user.event!.id
                } else {
                    config.params = {eventId: user.event!.id}
                }
            }

            if (user && user.role === UserRolesEnum.GUARD) {
                if (config.params) {
                    config.params.locationId = user.location!.id
                } else {
                    config.params = {locationId: user.location!.id}
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
                    user.event = data.event
                } else if(data.role === UserRolesEnum.GUARD) {
                    user.location = data.location
                } else {
                    user.eventName = data.eventName
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
    setUserInSession = (user: IUser) => localStorage.setItem('user', JSON.stringify(user))
}

const authService = new AuthService()

export default authService