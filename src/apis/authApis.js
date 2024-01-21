import axiosPrivate from './axios';
const authApis = {
    loginSession (data) {
        return axiosPrivate.post('/auth/login', data);
    },
    registerSession (data) {
        return axiosPrivate.post('/auth/register', data);
    },
    logout () { 
        axiosPrivate.post('/auth/logout');
    },

    refresh (data) { 
        axiosPrivate.post('/auth/refresh', data); 
    }
}

export default authApis