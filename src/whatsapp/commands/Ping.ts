import { Message } from "whatsapp-web.js";
import WACommand from "./WACommand.base";
import _commands from "./index";
import Whatsapp from "../Whatsapp";

export default class PingCommand extends WACommand {
    public static readonly commandName = "ping";
    public static readonly description = "Pong!";
    public static readonly aliases = [];
    public static readonly usage = "/ping";

    private readonly commands = _commands.sort((a, b) => a.commandName.localeCompare(b.commandName));


    constructor(whatsapp: Whatsapp) {
        super(whatsapp);
    }

    public async execute(message: Message, args: string[]) {
        await message.reply("Pong!")
    }
}