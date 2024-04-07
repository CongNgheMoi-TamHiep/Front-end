import axiosPrivate from "./axios";
import UserConversationApi from "./userConversationApi";

const ChatApi = {
  getChatByConversationId(id) {
    return axiosPrivate(`/chat/${id}`);
  },

  sendFile(file, type, conversationId, senderId) {
    return axiosPrivate.post(`/chat/files`, file, {
      params: {
        type,
        conversationId,
        senderId,
      },
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
      },
    });
  },
};

export default ChatApi;
