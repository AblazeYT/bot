import { Message, MessageMedia } from "whatsapp-web.js";
import WACommand from "./WACommand.base";

const dunk: MessageMedia = MessageMedia.fromFilePath("./assets/dunk.webp");

export default class DunkCommand extends WACommand {
    public static readonly commandName = "dunk";
    public static readonly description = "Get dunked on";
    public static readonly aliases: string[] = ["dunkon", "dunk on", "meg", "get dunked on", "get dunked", "rah", "rahh", "rahhh", "rahhhh", "rahhhhh", "rahhhhh", "rahhhhhh", "rahhhhhhh", "rahhhhhhhh", "rahhhhhhhhh", "rahhhhhhhhhh", "rahhhhhhhhhhh", "rahhhhhhhhhhhh"];
    public static readonly usage = "";

    public async execute(message: Message, args: string[]) {
        if (message.hasQuotedMsg) {message = await message.getQuotedMessage();}
        
        await message.reply(dunk, undefined, { sendMediaAsSticker: true });
        
    }
}