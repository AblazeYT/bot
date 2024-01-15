import { Message, MessageMedia } from "whatsapp-web.js";
import WACommand from "./WACommand.base";
import Whatsapp from "../Whatsapp";

export default class BurgerkingCommand extends WACommand {
    public static readonly commandName = "burgerking";
    public static readonly description = "who is it";
    public static readonly aliases: string[] = ["whoistheburgerking"];
    public static readonly usage = "/burgerking";

    constructor(whatsapp: Whatsapp) {
        super(whatsapp);
    }

    public async execute(message: Message, args: string[]) {
        const burgerking = MessageMedia.fromFilePath("./assets/burgerking.jpg");
        
        await message.reply(burgerking, undefined, { sendMediaAsSticker: true })
    }
}