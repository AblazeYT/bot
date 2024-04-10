import { Message, Contact } from "whatsapp-web.js";
import Stats from "../Statistics";
import WACommand from "./WACommand.base";

export default class AdminCommand extends WACommand {
    public static readonly commandName = "admin";
    public static readonly description = "do admin related stuff";
    public static readonly aliases: string[] = ["admins"];
    public static readonly usage = "🛡️[add, remove] or [list]";

    public async execute(message: Message, args: string[]) {
        message.react('⏳')
        if (args.length === 0) {
            message.react('❌')
            message.reply("Do something! ")
        }
        else {
            args[0] = args[0].toLowerCase()
            if (args[0] === "list") {
                const admins = await Stats.getAdmins();
                console.log(`yay ${admins}`)
                message.reply(admins.length === 0 ? "There are no admins!" : admins.map((admin) => `${admin.id._serialized}`).join("\n"))
                message.react('✅');
                return
            }
            const contact = await message.getContact();
            if (!Stats.isAdmin(contact)) {
                message.react('🛡️');
                message.reply("You are not an admin! ");
                return
            }
            const mentions: Contact[] = await message.getMentions();
            if (mentions.length === 0) {
                message.reply("No people mentioned!");
                message.react('❌');
                return
            }
            switch (args[0]) {
                case "add":
                    await Stats.addAdmins(mentions);
                    message.react('✅');
                case "remove":
                    await Stats.removeAdmins(mentions);
                    message.react('✅');
            }
        }
    }
}
