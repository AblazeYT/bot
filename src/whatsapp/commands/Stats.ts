import { Message, Chat, GroupChat } from "whatsapp-web.js";
import Stats from "../Statistics";
import WACommand from "./WACommand.base";

export default class StatsCommand extends WACommand {
    public static readonly commandName = "stats";
    public static readonly description = "View statistics for this chat! ";
    public static readonly aliases: string[] = ["statistics", "stat", "info", "statisticsgcse", "statsgcse", "kervin"];
    public static readonly usage = "stats";

    public async execute(message: Message, args: string[]) {
        const chat: any = await message.getChat();
        if (args.length != 0) {
            const contact = await message.getContact();
            const isAdmin = await Stats.isAdmin(contact)
            switch (args[0].toLowerCase()) {
                case ".reset":
                    if (isAdmin) {
                        await Stats.clearChat(chat)
                        message.reply("[#] Statistics reset for this chat")
                    }
                    else {
                        message.reply("You are not a bot admin! ")
                        message.react('🛡️')
                    }
                    break
                case "other":
                    message.react('❓')
                    break
            }
            return
        }
        let data = await Stats.readChat(chat);
        if (data == null) {
            data = await Stats.readChat(chat);
        }
        let amountOfParticipants = 0
        if (chat.isGroup) {
            amountOfParticipants = chat.participants.length
        }
        else {
            amountOfParticipants = 1
        }
        const timeStarted = new Date(Date.parse(data.timeStartedCounting))
        const outputMessage = `*Statistics for "${chat.name}"*\n*${data.messagesSent}* message${data.messagesSent == 1 ? '' : 's'} sent\nMedia sent *${data.mediaSent}* time${data.mediaSent == 1 ? '' : 's'}\n*${data.mentions}* ${data.mentions == 1 ? "person" : "people"} mentioned\n\n\nRecorded since ${timeStarted.toUTCString()}`
        message.reply(outputMessage)
    }
}
