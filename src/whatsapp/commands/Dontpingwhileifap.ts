import { Message, MessageMedia } from "whatsapp-web.js";
import WACommand from "./WACommand.base";
import Whatsapp from "../Whatsapp";

export default class DontpingwhileifapCommand extends WACommand {
    public static readonly commandName = "dontpingwhileifap";
    public static readonly description = "it's chale's fault";
    public static readonly aliases: string[] = ["dpwif"];
    public static readonly usage = "dontpingwhileifap";

    constructor(whatsapp: Whatsapp) {
        super(whatsapp);
    }

    public async execute(message: Message, args: string[]) {
        const gif = MessageMedia.fromFilePath("./assets/dontpingwhileifap.mp4");
        
        await message.reply(gif, undefined, { sendVideoAsGif: true })
    }
}