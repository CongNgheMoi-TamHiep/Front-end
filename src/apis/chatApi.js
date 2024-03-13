import axiosPrivate from "./axios";
import UserConversationApi from "./userConversationApi";

const ChatApi = {
  getChatByConversationId(id) {
    return axiosPrivate(`/chat/${id}`);
  },

  async sendChatSingle(newChat, memberUser) {
    const chat = await axiosPrivate.post(`/chat`, newChat);
    const lastMess = chat;
    delete lastMess.conversationId;
    for (let member of memberUser)
      await UserConversationApi.update(
        member._id,
        newChat.conversationId,
        lastMess
      );
    return chat;
  },
};

export default ChatApi;
