import apiHelper from "./ApiHelper";
import {IUserRequest} from "../models/IUser";

class UserService {
    getUsers = (page: number, size: number, search: string) => apiHelper.get(`/users`, {search, size, page})

    getUser = (userId: string) => apiHelper.get(`/users/${userId}`)

    postNewUser = (user: IUserRequest) => apiHelper.post<IUserRequest>(`/users`, user)

    putUpdateUser = (user: IUserRequest) => apiHelper.put<IUserRequest>(`/users/${user.id!}`, user)

    deleteUser = (userId: number) => apiHelper.delete(`/users/${userId}`)
}

 const userService = new UserService()

 export default userService;