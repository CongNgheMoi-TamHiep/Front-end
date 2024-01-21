import axios from "axios";
import axiosPrivate from "./axios";

const userApis = {
    getAllUsers () { 
        return axiosPrivate("/user");
    },
    getUserById (id) { 
        return axiosPrivate(`/user/${id}`);
    },
    updateAnUserById (id, data) {
        return axiosPrivate.patch(`/user/${id}`, data);
    },
    deleteUserById (id) {
        return axiosPrivate.delete(`/user/${id}`);
    }
}

export default userApis;