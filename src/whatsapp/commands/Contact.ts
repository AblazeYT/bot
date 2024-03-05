import { Message, Contact } from "whatsapp-web.js";
import WACommand from "./WACommand.base";

export default class ContactCommand extends WACommand {
    public static readonly commandName = "contact";
    public static readonly description = "Get a contact's ID";
    public static readonly aliases: string[] = [];
    public static readonly usage = "contact";

    public async execute(message: Message, args: string[]) {
        if (message.hasQuotedMsg) {message = await message.getQuotedMessage();}
        const contact: Contact = await message.getContact();
        await message.reply(contact.id._serialized);
        
    }
}
