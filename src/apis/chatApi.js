import axiosPrivate from "./axios";
import UserConversationApi from "./userConversationApi";

const ChatApi = {
  getChatByConversationId(id) {
    return axiosPrivate(`/chat/${id}`);
  },

};

export default ChatApi;
