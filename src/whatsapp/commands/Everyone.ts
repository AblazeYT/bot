import { Message, GroupChat } from "whatsapp-web.js";
import WACommand from "./WACommand.base";

export default class EveryoneCommand extends WACommand {
    public static readonly commandName = "everyone";
    public static readonly description = "Mentions everyone in the group chat!";
    public static readonly aliases: string[] = ["pa", "@everyone", "@", "@a", "@e", "all", "p"];
    public static readonly usage = "everyone";

    public async execute(message: Message, args: string[]) {
        if (message.hasQuotedMsg) {message = await message.getQuotedMessage();}

        const chat = await message.getChat() as GroupChat
        let mentions: any[] = []
        if (chat.isGroup) {
            for (const participant of chat.participants) {
                mentions.push(participant.id._serialized)
            }

            await message.reply(mentions.map(x => "@" + x.split("@")[0]).join(" "), undefined, {mentions})
        }
    }
}
