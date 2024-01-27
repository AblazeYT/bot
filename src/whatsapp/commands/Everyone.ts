import { Message, GroupChat } from "whatsapp-web.js";
import WACommand from "./WACommand.base";
import Whatsapp from "../Whatsapp";

export default class EveryoneCommand extends WACommand {
    public static readonly commandName = "everyone";
    public static readonly description = "Mentions everyone in the group chat!";
    public static readonly aliases: string[] = ["pa", "@everyone"];
    public static readonly usage = "/everyone";

    constructor(whatsapp: Whatsapp) {
        super(whatsapp);
    }

    public async execute(message: Message, args: string[]) {
        if (message.hasQuotedMsg) {message = await message.getQuotedMessage();}

        const chat = await message.getChat() as GroupChat
        let mentions: any[] = []
        if (chat.isGroup) {
            for (const participant in chat.participants) {
                const person = chat.participants[participant]
                mentions.push(person.id._serialized)
            }

            await message.reply(mentions.map(x => "@" + x.split("@")[0]).join(" "), undefined, {mentions})
        }
    }
}
