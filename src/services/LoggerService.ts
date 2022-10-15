import apiHelper from "./ApiHelper";

class LoggerService {
    getListLogger = (page: number, size: number, search: string, locationId: number) => {
        let extraParams
        locationId && (extraParams = {locationId})
        return apiHelper.get(`/guests/location`, {search, size, page, extraParams})
    }

    getExcelList = () => apiHelper.get(`/guests/location/excel`,{responseType: "blob"})
}

const loggerService = new LoggerService()
export default loggerService
