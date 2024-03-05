import { Message } from "whatsapp-web.js";
import WACommand from "./WACommand.base";

export default class PongCommand extends WACommand {
    public static readonly commandName = "pong2";
    public static readonly description = "Ping2!";
    public static readonly aliases: string[] = [];
    public static readonly usage = "pong2";

    public async execute(message: Message, args: string[]) {
        message.reply("Ping2!")
    }
}