import axios from 'axios';

const API:any = axios.create({
    baseURL: 'http://localhost:5000',
});

export default API;
