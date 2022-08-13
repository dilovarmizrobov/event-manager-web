import apiHelper from "./ApiHelper";

class AppService {
    getDashboardData = () => apiHelper.get(`/guests/location/dashboard`)
}

const appService = new AppService()

export default appService
