import { Message, MessageMedia } from "whatsapp-web.js";
import WACommand from "./WACommand.base";

const burgerking: MessageMedia = MessageMedia.fromFilePath("./assets/burgerking.jpg");

export default class BurgerkingCommand extends WACommand {
    public static readonly commandName = "burgerking";
    public static readonly description = "who is it";
    public static readonly aliases: string[] = ["whoistheburgerking"];
    public static readonly usage = "";

    public async execute(message: Message, args: string[]) {
        message.react('⏳');
        if (message.hasQuotedMsg) {message = await message.getQuotedMessage()}
        await message.reply(burgerking, undefined, { sendMediaAsSticker: true });
        message.react('✅');
    }
}
