import { Message, GroupChat } from "whatsapp-web.js";
import Whatsapp from "../Whatsapp";
import Stats from "../Statistics";
import WACommand from "./WACommand.base";

// this command is not functional right now come back later

export default class BanCommand extends WACommand {
    public static readonly commandName = "ban";
    public static readonly description = "yippee";
    public static readonly aliases: string[] = ["kill"];
    public static readonly usage = "Work in Progress";

    public async execute(message: Message, args: string[]) {
        message.react('⏳');
        const chat = await message.getChat() as GroupChat;
        if (args.length === 0) {
            message.reply("Who are you banning? ")
            message.react('❌')
        }
        else if (args[0].toLowerCase() == "kervin") {
            try {
                const contact = await Whatsapp.client.getContactById("447375514559@c.us");
                let contactInChat = false;
                for (const participant of chat.participants) {
                    if (contact.id._serialized == participant.id._serialized) {contactInChat = true}
                }
                if (contactInChat === false) {throw new Error}
                //Stats.banUser(contact, chat); - poor kervin
                message.react('✅');
            }
            catch(error) {
                message.reply("Kervin Sunassee does not exist")
                message.react('❌')
            }
        }
        else {message.react('❌')}
    }
}
