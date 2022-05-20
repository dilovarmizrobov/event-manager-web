import apiHelper from "./ApiHelper";
import api from "../utils/api";
import {IBadgeRequest} from "../models/IBadge";

class BadgeService {

    getBadge = (badgeId: string) => apiHelper.get(`/badge-templates/${badgeId}`)

    getOptionBadges = () => apiHelper.get(`/badge-templates/option`)

    getBadges = () => apiHelper.get(`/badge-templates`)

    getDownloadBadge = (fileName: string) =>
        apiHelper.get(`/badge-templates/load-badge/${fileName}`, {responseType: "blob"})

    postNewBadge = (badge: IBadgeRequest) => new Promise((resolve, reject) => {
        let formData = new FormData();

        let length = badge.files?.length || 0;

        for (let i = 0; i < length; i++) {
            formData.append('files', badge.files![i]);
        }

        const json = {
            name: badge.name,
        };

        const blob = new Blob([JSON.stringify(json)], {type: 'application/json'});

        formData.append('info', blob);

        api.post(`/badge-templates`, formData)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

    putUpdateBadge = (badge: IBadgeRequest) => new Promise((resolve, reject) => {
        let formData = new FormData();

        let length = badge.files?.length || 0;

        for (let i = 0; i < length; i++) {
            formData.append('files', badge.files![i]);
        }

        const json = {
            id: badge.id,
            name: badge.name,
        };

        const blob = new Blob([JSON.stringify(json)], {type: 'application/json'});

        formData.append('info', blob);

        api.put(`/badge-templates/${badge.id!}`, formData)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

    deleteBadge = (badgeId: number) => apiHelper.delete(`/badge-templates/${badgeId}`)
}

const badgeService = new BadgeService();

export default badgeService;