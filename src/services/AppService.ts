import apiHelper from "./ApiHelper";

class AppService {
    getDashboardData = (locationId: number) => {
        return apiHelper.get(`/guests/location/dashboard`, {locationId})
    }
}

const appService = new AppService()

export default appService
