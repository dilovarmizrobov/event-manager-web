import api from "../utils/api";

class CountryService {
    getCountries = () => new Promise((resolve, reject)  => {
        api.get(`/countries`)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })
}

const countryService = new CountryService()

export default countryService