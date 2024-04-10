import { Message } from "whatsapp-web.js";
import WACommand from "./WACommand.base";

export default class PingCommand extends WACommand {
    public static readonly commandName = "ping";
    public static readonly description = "Pong!";
    public static readonly aliases: string[] = [];
    public static readonly usage = "";

    public async execute(message: Message, args: string[]) {
        await message.reply("Pong!");
    }
}