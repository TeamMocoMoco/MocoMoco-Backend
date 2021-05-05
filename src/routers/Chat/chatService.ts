import { Chat, ChatModel } from "../../models/Chat";
export default class ChatService {
  private chatModel = ChatModel;
  constructor() {}
  getChatById = async (roomId: string): Promise<Chat[]> => {
    try {
      const contents = await this.chatModel.find({ roomId });
      contents.map((content:Chat)=>{
        console.log(content.createdAt)
        const duration = 9*60*60*1000
        content.createdAt.setTime(content.createdAt.getTime() + duration);
        return content
      })
      return contents;
    } catch (err) {
      throw new Error(err);
    }
  };

  creatChat = async (
    chatData: Chat,
    userId: string,
    roomId: string
  ): Promise<Chat> => {
    try {
      const chat = new this.chatModel({
        user: userId,
        roomId,
        content: chatData.content,
      });
      await chat.save();
      return chat;
    } catch (err) {
      throw new Error(err);
    }
  };
}
