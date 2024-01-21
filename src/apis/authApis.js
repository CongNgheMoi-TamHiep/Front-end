import axiosPrivate from './axios';
const authApis = {
    loginSession (data) {
        return axiosPrivate.post('/auth/login', data);
    },
    registerSession (data) {
        return axiosPrivate.post('/auth/register', data);
    },
    logout () { 
        return axiosPrivate.post('/auth/logout');
    }
}

export default authApis