import { Message } from "whatsapp-web.js";
import WACommand from "./WACommand.base";
import _commands from "./index";
import Whatsapp from "../Whatsapp";

export default class EveryoneCommand extends WACommand {
    public static readonly commandName = "everyone";
    public static readonly description = "Mentions everyone in the group chat!";
    public static readonly aliases = ["pa"];
    public static readonly usage = "/everyone";

    private readonly commands = _commands.sort((a, b) => a.commandName.localeCompare(b.commandName));


    constructor(whatsapp: Whatsapp) {
        super(whatsapp);
    }

    public async execute(message: Message, args: string[]) {
        const chat: any = await message.getChat()
        let pa = ""
        let mentions = []
        if (chat.isGroup) {
            for (let participant in chat.participants) {
                const person = chat.participants[participant]
                mentions[participant] = `${person.id.user}@c.us`
                pa += `@${person.id.user} `
            }
            await chat.sendMessage(pa, {mentions: mentions})
        }
        return
    }
}