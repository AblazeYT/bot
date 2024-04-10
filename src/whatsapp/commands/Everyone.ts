import { Message, GroupChat, GroupParticipant } from "whatsapp-web.js";
import WACommand from "./WACommand.base";

export default class EveryoneCommand extends WACommand {
    public static readonly commandName = "everyone";
    public static readonly description = "Mentions everyone in the group chat!";
    public static readonly aliases: string[] = ["pa", "@everyone", "@", "@a", "@e", "all", "p"];
    public static readonly usage = "";

    public async execute(message: Message, args: string[]) {
        const chat: GroupChat = await message.getChat() as GroupChat
        if (chat.isGroup) {
            if (message.hasQuotedMsg) {message = await message.getQuotedMessage();}

            let mentions: string[] = []
            for (const participant of chat.participants) {
                mentions.push(participant.id._serialized)
            }

            await message.reply(mentions.map(x => "@" + x.split("@")[0]).join(" "), undefined, {mentions})
        }
    }
}
