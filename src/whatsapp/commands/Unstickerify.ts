import { Message, MessageMedia } from "whatsapp-web.js";
import WACommand from "./WACommand.base";

export default class UnstickerifyCommand extends WACommand {
    public static readonly commandName = "unstickerify";
    public static readonly description = "Turn any sticker into an image!";
    public static readonly aliases: string[] = ["unsticker", "unstick"];
    public static readonly usage = "unstickerify [attach: sticker/gif]";

    public async execute(message: Message, args: string[]) {
        message.react('⏳')
        let image: MessageMedia
        if (message.hasMedia) {
            image = await message.downloadMedia()
        }
        else if (message.hasQuotedMsg) {
            const originalMsg = await message.getQuotedMessage()
            image = await originalMsg.downloadMedia()
        }
        else {
            message.react('❌')
            message.reply("No media attached! ")
            return
        }
        await message.reply(image, undefined, { sendMediaAsSticker: false })
        message.react('✅')
    }
}