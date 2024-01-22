import axios from "axios";
import { auth } from "../firebase";
import axiosRetry from "axios-retry";
import { ref } from "firebase/storage";
import authApis from "./authApis";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5500/api";
const validRefresh = new RegExp(".*/api/refresh/");
const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { "Content-Type": "application/json" },
});
axiosPrivate.defaults.withCredentials = true;

axiosPrivate.interceptors.request.use(
    (config) => {
        // Do something before request is sent
        return config;
    },
    (error) => {
        // Do something with request error
        return Promise.reject(error);
    }
);

axiosPrivate.interceptors.response.use(
    (response) => {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        return response;
    },
    async (error) => {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error

        // auto refresh Token
        console.log(error)
        if (error.response?.status === 401) {
            if( error.response.data === 'refreshTokenExpired' ) { 
                auth.signOut();
                authApis.logout(); 
            }
            else if (auth.currentUser) {
                await auth.currentUser.getIdToken(/* forceRefresh */ true);
                authApis.refresh({
                    accessToken: auth.currentUser.accessToken,
                    refreshToken: auth.currentUser.refreshToken,
                });
            }
        }
        return Promise.reject(error);
    }
);

axiosRetry(axiosPrivate, {
    retries: 2, // number of retries
    retryDelay: (retryCount) => {
        console.log(`retry attempt: ${retryCount}`);
        return retryCount * 1000; // time interval between retries
    },
    retryCondition: (error) => {
        return (
            error.response?.status === 401 &&
            validRefresh.test(error.request.url)
        );
    },
});

export default axiosPrivate;
