import { IMatch } from "./IMatch"
export interface IMessage{

    senderName: string,
    receiverName: string,
    message :IMatch,
    status?: string
  }
