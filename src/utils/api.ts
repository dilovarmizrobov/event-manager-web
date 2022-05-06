import axios from 'axios';

const instance = axios.create({baseURL: 'duobtms'});

export default instance;
