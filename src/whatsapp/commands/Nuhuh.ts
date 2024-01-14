import { Message, MessageMedia } from "whatsapp-web.js";
import WACommand from "./WACommand.base";
import Whatsapp from "../Whatsapp";

export default class NuhuhCommand extends WACommand {
    public static readonly commandName = "nuhuh";
    public static readonly description = "Nuh uh!";
    public static readonly aliases: string[] = [];
    public static readonly usage = "/nuhuh";

    constructor(whatsapp: Whatsapp) {
        super(whatsapp);
    }

    public async execute(message: Message, args: string[]) {
        const nuhuh = MessageMedia.fromFilePath("./assets/nuhuh.jpg");
        
        if (message.hasQuotedMsg) {message = await message.getQuotedMessage();}
        
        await message.reply(nuhuh, undefined, { sendMediaAsSticker: true });
    }
}
