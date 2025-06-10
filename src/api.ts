import axios from 'axios';

const API:any = axios.create({
    baseURL: 'http://localhost:8000',
});

export default API;
