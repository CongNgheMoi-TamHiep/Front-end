import { auth } from '@/firebase';
import axiosPrivate from './axios';
import { revokeAccessToken } from 'firebase/auth';
const authApis = {
    loginSession (data) {
        axiosPrivate.post('/auth/login', data);
    },
    registerSession (data) {
        axiosPrivate.post('/auth/register', data);
    },
    async logout () { 
        await axiosPrivate.post('/auth/logout', { uid: auth.currentUser.uid });
        await auth.signOut();
    },

    refresh (data) { 
        axiosPrivate.post('/auth/refresh', data); 
    }
}

export default authApis