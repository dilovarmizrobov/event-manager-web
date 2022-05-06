import {IUser} from "../models/IUser";
import api from "../utils/api";

class AuthService {
    setAxiosInterceptors = (onLogout: VoidFunction) => {
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
    }

    login = (username: string, password: string) => new Promise((resolve, reject) => {
        const params = new URLSearchParams()
        params.append('username', username)
        params.append('password', password)

        api.post('authenticate', params)
            .then((response) => {
                const user = {name: response.data.name, roles: response.data.roles}
                this.setUserAndJwtInSession(response.data.jwt, user as IUser)

                resolve(user as IUser)
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
    getUserFromSession = () => JSON.parse(localStorage.getItem('user') as string);
    isAuthenticated = () => Boolean(this.getJwtFromSession())
}

const authService = new AuthService()

export default authService