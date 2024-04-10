import { Message, MessageMedia } from "whatsapp-web.js";
import WACommand from "./WACommand.base";

const gif: MessageMedia = MessageMedia.fromFilePath("./assets/dontpingwhileifap.mp4");

export default class DontpingwhileifapCommand extends WACommand {
    public static readonly commandName = "dontpingwhileifap";
    public static readonly description = "it's chale's fault";
    public static readonly aliases: string[] = ["dpwif"];
    public static readonly usage = "";

    public async execute(message: Message, args: string[]) {
        message.react('⏳')
        if (message.hasQuotedMsg) {message = await message.getQuotedMessage();}
        await message.reply(gif, undefined, { sendMediaAsSticker: true });
        message.react('✅')
    }
}