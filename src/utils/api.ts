import axios from 'axios';

const instance = axios.create({baseURL: '/event-manager'});

export default instance;
