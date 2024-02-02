import { Message, Chat, GroupChat } from "whatsapp-web.js";
import Stats from "../Statistics";
import WACommand from "./WACommand.base";
import Whatsapp from "../Whatsapp";

export default class StatsCommand extends WACommand {
    public static readonly commandName = "stats";
    public static readonly description = "View statistics for this chat! ";
    public static readonly aliases: string[] = ["statistics", "stat", "info"];
    public static readonly usage = "stats";

    constructor(whatsapp: Whatsapp) {
        super(whatsapp);
    }

    public async execute(message: Message, args: string[]) {
        const chat: any = await message.getChat();
        let data = await Stats.readChat(chat);
        if (data == null) {
            data = await Stats.readChat(chat);
        }
        let amountOfParticipants = 0
        if (chat.isGroup) {
            amountOfParticipants = chat.participants.length
        }
        else {
            amountOfParticipants = 2
        }
        const timeStarted = new Date(Date.parse(data.timeStartedCounting))
        const outputMessage = `*Statistics for "${chat.name}"*\n*${amountOfParticipants}* participants\n*${data.messagesSent}* messages sent\n*${data.mentions}* people mentioned\n\n\nRecorded since ${timeStarted.toUTCString()}`
        message.reply(outputMessage)
    }
}
