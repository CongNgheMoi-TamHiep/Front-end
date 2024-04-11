import axiosPrivate from "./axios";

const FriendApi = {
  getUserPhoneBook(userId) {
    return axiosPrivate.get(`/friens/phonedBook/${userId}`);
  },

  getFriends(userId) {
    return axiosPrivate.get(`/friends/${userId}`);
  }
};

export default FriendApi;
