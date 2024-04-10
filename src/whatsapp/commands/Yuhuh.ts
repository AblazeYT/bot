import { Message, MessageMedia } from "whatsapp-web.js";
import WACommand from "./WACommand.base";

const nuhuh = MessageMedia.fromFilePath("./assets/yuhuh.jpg");

export default class YuhuhCommand extends WACommand {
    public static readonly commandName = "yuhuh";
    public static readonly description = "Yuh uh!";
    public static readonly aliases: string[] = ["yuh uh", "yes"];
    public static readonly usage = "";

    public async execute(message: Message, args: string[]) {
        if (message.hasQuotedMsg) {message = await message.getQuotedMessage();}
        
        await message.reply(nuhuh, undefined, { sendMediaAsSticker: true });
        
    }
}