import { Message, MessageMedia } from "whatsapp-web.js";
import WACommand from "./WACommand.base";
import Whatsapp from "../Whatsapp";

const gif = MessageMedia.fromFilePath("./assets/dontpingwhileifap.mp4");

export default class DontpingwhileifapCommand extends WACommand {
    public static readonly commandName = "dontpingwhileifap";
    public static readonly description = "it's chale's fault";
    public static readonly aliases: string[] = ["dpwif"];
    public static readonly usage = "/dontpingwhileifap";

    constructor(whatsapp: Whatsapp) {
        super(whatsapp);
    }

    public async execute(message: Message, args: string[]) {

        await message.reply(gif, undefined, { sendMediaAsSticker: true });

    }
}