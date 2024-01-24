import axiosPrivate from "./axios";

const userApis = {
    async getAllUsers () { 
        const users = await axiosPrivate("/user");
        return users;
    },
    async getUserById (id) { 
        const user = await axiosPrivate(`/user/${id}`);
        return user; 
    },
    updateAnUserById (id, data) {
        axiosPrivate.patch(`/user/${id}`, data);
    },
    deleteUserById (id) {
        axiosPrivate.delete(`/user/${id}`);
    }
}

export default userApis;