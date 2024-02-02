import { Message } from "whatsapp-web.js";
import WACommand from "./WACommand.base";
import Whatsapp from "../Whatsapp";

export default class AlfieCommand extends WACommand {
    public static readonly commandName = "alfieelliott";
    public static readonly description = "what is he doing now";
    public static readonly aliases: string[] = ["alfie", "anthony", "elliott", "robloxsweat", "robloxaddict"];
    public static readonly usage = "alfieelliott";

    constructor(whatsapp: Whatsapp) {
        super(whatsapp);
    }

    public async execute(message: Message, args: string[]) {
        message.react('⏳')
        if (message.hasQuotedMsg) {message = await message.getQuotedMessage();}
        await message.reply("www.roblox.com/users/3759730738/profile?friendshipSourceType=PlayerSearch", undefined, { linkPreview: true });
        message.react('✅')
    }
}
