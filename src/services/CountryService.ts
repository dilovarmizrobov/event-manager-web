import api from "../utils/api";
import {ICountryRequest} from "../models/ICountry";
import apiHelper from "./ApiHelper";

class CountryService {
    getCountry = (countryId: string) => apiHelper.get(`/countries/${countryId}`)

    getOptionCountries = () => apiHelper.get(`/countries/option`)

    getListCountry = (page: number, size: number, search: string) =>
        apiHelper.get(`/countries`, {search, size, page})

    postNewCountry = (country: ICountryRequest) => new Promise((resolve, reject) => {
        let formData = new FormData();

        formData.append('flag', country.flag!);

        const json = {
            name: country.name,
            abbr: country.abbr,
        };

        const blob = new Blob([JSON.stringify(json)], {type: 'application/json'});

        formData.append('info', blob);

        api.post(`/countries`, formData)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

    putUpdateCountry = (country: ICountryRequest) => new Promise((resolve, reject) => {
        let formData = new FormData();

        formData.append('flag', country.flag || "");

        const json = {
            id: country.id,
            name: country.name,
            abbr: country.abbr,
        };

        const blob = new Blob([JSON.stringify(json)], {type: 'application/json'});

        formData.append('info', blob);

        api.put(`/countries/${country.id!}`, formData)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

    deleteCountry = (countryId: number) => apiHelper.delete(`/countries/${countryId}`)
}

const countryService = new CountryService()

export default countryService