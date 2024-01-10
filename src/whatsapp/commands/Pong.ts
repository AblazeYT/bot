import { Message } from "whatsapp-web.js";
import WACommand from "./WACommand.base";
import _commands from "./index";
import Whatsapp from "../Whatsapp";

export default class PongCommand extends WACommand {
    public static readonly commandName = "pong";
    public static readonly description = "Ping!";
    public static readonly aliases = [];
    public static readonly usage = "/pong";

    private readonly commands = _commands.sort((a, b) => a.commandName.localeCompare(b.commandName));


    constructor(whatsapp: Whatsapp) {
        super(whatsapp);
    }

    public async execute(message: Message, args: string[]) {
        await message.reply("Ping!")
    }
}