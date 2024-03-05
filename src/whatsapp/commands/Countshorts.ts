import { Message, Chat } from "whatsapp-web.js";
import WACommand from "./WACommand.base";

export default class CountshortsCommand extends WACommand {
    public static readonly commandName = "countshorts";
    public static readonly description = "How many Youtube Shorts have been sent in this chat?";
    public static readonly aliases: string[] = ["shortcount", "shortc", "countshort"];
    public static readonly usage = "countshorts";

    public async execute(message: Message, args: string[]) {
        if (message.hasQuotedMsg) {message = await message.getQuotedMessage();}
        const chat = await message.getChat();
        const messages = await chat.fetchMessages({limit: 99999999, fromMe: undefined}); //setting limit to Infinity only returns recent messages
        let shortsSent = 0
        for (const message of messages) {
            if (message.body.includes("https://youtu") && message.body.includes("shorts")) {shortsSent += 1}
        }
        await message.reply(`${shortsSent} short${shortsSent == 1 ? '' : 's'} have been sent to this chat`)
    }
}
