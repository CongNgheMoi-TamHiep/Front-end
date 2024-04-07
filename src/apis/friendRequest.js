import { get } from "http";
import axiosPrivate from "./axios";
import { use } from "react";

const FriendRequest = {
  getFriendByNumber(number) {
    return axiosPrivate.get(`/user/number/${number}`);
  },

  checkFriend(userID1, userID2) {
    return axiosPrivate.get(`/friendRequest/state`, {
      params: {
        userId1: userID1,
        userId2: userID2,
      },
    });
  },
};

export default FriendRequest;
