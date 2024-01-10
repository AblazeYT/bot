import { Message, GroupChat, Contact } from "whatsapp-web.js";
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
        const chat = await message.getChat() as GroupChat
        let text = ""
        let mentions: any[] = []
        if (chat.isGroup) {
            for (const participant in chat.participants) {
                const person = chat.participants[participant]
                mentions.push(person.id._serialized)
                text += `${person.id._serialized} `
            }
            await chat.sendMessage(text, {mentions})
        }
    }
}