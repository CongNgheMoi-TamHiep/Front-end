import axiosPrivate from "./axios";
import UserConversationApi from "./userConversationApi";

const ChatApi = {
  getChatByConversationId(id) {
    return axiosPrivate(`/chat/${id}`);
  },

  sendChatSingle(newChat, memberUserId, lastMess) {
    axiosPrivate.post(`/chat`, newChat);
    UserConversationApi.update(
      memberUserId,
      newChat.conversationId,
      lastMess
    );
  },
};

export default ChatApi;
