import { Message } from "whatsapp-web.js";
import WACommand from "./WACommand.base";

export default class PongCommand extends WACommand {
    public static readonly commandName = "pong";
    public static readonly description = "Ping!";
    public static readonly aliases: string[] = [];
    public static readonly usage = "";

    public async execute(message: Message, args: string[]) {
        await message.reply("Ping!")
    }
}