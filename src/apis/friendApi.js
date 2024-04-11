import axiosPrivate from "./axios";

export default FriendApi = {
  getUserPhoneBook(userId) {
    return axiosPrivate.get(`/friens/phonedBook/${userId}`);
  },

  getFriends(userId) {
    return axiosPrivate.get(`/friens/${userId}`);
  }
};
