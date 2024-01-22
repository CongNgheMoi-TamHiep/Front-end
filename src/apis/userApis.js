import axios from "axios";
import axiosPrivate from "./axios";

const userApis = {
    // checked
    getAllUsers () { 
        return axiosPrivate("/user");
    },

    // checked
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