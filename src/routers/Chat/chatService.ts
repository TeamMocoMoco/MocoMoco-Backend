import { Chat, ChatModel } from "../../models/Chat";
export default class ChatService {
  private chatModel = ChatModel;
  constructor() {}

  getChatById = async (roomId: string): Promise<Chat[]> => {
    const contents = await this.chatModel.find({ roomId });
    return contents;
  };

  creatChat = async (
    chatData: Chat,
    userId: string,
    roomId: string
  ): Promise<Chat> => {
    const chat = new this.chatModel({
      user: userId,
      roomId,
      content: chatData.content,
    });
    await chat.save();
    return chat;
  };
}
