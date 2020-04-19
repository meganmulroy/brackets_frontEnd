import axios from 'axios';
import auth from '@/auth.js';

const apiClient = axios.create({
    baseURL: 'http://localhost:8080/AuthenticationApplication',
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + auth.getToken()
    }
});

export default {

    updateAuthorization() {
        apiClient.defaults.headers.Authorization = 'Bearer ' + auth.getToken();
    },

    getUser() {       
        return apiClient.get('/profile').then(response => response.data);
    }

}