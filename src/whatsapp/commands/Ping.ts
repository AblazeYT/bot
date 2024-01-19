import { Message } from "whatsapp-web.js";
import WACommand from "./WACommand.base";
import Whatsapp from "../Whatsapp";

export default class PingCommand extends WACommand {
    public static readonly commandName = "ping";
    public static readonly description = "Pong!";
    public static readonly aliases: string[] = [];
    public static readonly usage = "/ping";

    constructor(whatsapp: Whatsapp) {
        super(whatsapp);
    }

    public async execute(message: Message, args: string[]) {
        message.reply("Pong!");
    }
}