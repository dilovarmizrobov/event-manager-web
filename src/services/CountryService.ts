import api from "../utils/api";
import {ICountryRequest} from "../models/ICountry";


class CountryService {

    getCountry = (countryId: string) => new Promise((resolve, reject)  => {
        api.get(`/countries/${countryId}`)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

    getCountries = () => new Promise((resolve, reject)  => {
        api.get(`/countries`)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

    getListCountry = (page: number, size: number, search: string) => new Promise((resolve, reject)  => {
        api.get(`/countries`, {params : {search, size, page}})
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

    postNewCountry = (countryRequest: ICountryRequest) => new Promise((resolve, reject) => {
        let formData = new FormData();

        formData.append('flag', countryRequest.flag!, 'flag.jpg');

        delete countryRequest.flag

        const json = JSON.stringify(countryRequest);
        const blob = new Blob([json], {type: 'application/json'});

        formData.append('info', blob);

        api.post(`/countries`, formData)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

    putUpdateCountry = (countryRequest: ICountryRequest) => new Promise((resolve, reject) => {
        let formData = new FormData();

        formData.append('flag', countryRequest.flag!, 'flag.jpg');

        delete countryRequest.flag

        const json = JSON.stringify(countryRequest);
        const blob = new Blob([json], {type: 'application/json'});

        formData.append('info', blob);

        api.put(`/countries/${countryRequest.id!}`, formData)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

}

const countryService = new CountryService()

export default countryService