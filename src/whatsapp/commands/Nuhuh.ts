import { Message, MessageMedia } from "whatsapp-web.js";
import WACommand from "./WACommand.base";

const nuhuh: MessageMedia = MessageMedia.fromFilePath("./assets/nuhuh.jpg");

export default class NuhuhCommand extends WACommand {
    public static readonly commandName = "nuhuh";
    public static readonly description = "Nuh uh!";
    public static readonly aliases: string[] = ["nuh uh", "no"];
    public static readonly usage = "";

    public async execute(message: Message, args: string[]) {
        if (message.hasQuotedMsg) {message = await message.getQuotedMessage();}
        
        await message.reply(nuhuh, undefined, { sendMediaAsSticker: true });
        
    }
}