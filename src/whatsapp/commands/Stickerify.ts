import { Message, MessageMedia } from "whatsapp-web.js";
import WACommand from "./WACommand.base";

export default class StickerifyCommand extends WACommand {
    public static readonly commandName = "stickerify";
    public static readonly description = "Turn any image into a sticker!";
    public static readonly aliases: string[] = ["sticker", "stick"];
    public static readonly usage = "stickerify [attach: image/video]";

    public async execute(message: Message, args: string[]) {
        message.react('⏳')
        const chat = await message.getChat()
        let image: MessageMedia
        if (message.hasMedia) {
            image = await message.downloadMedia()
        }
        else if (message.hasQuotedMsg) {
            const originalMsg = await message.getQuotedMessage()
            image = await originalMsg.downloadMedia()
        }
        else {
            return
        }
        await message.reply(image, chat.id._serialized, {sendMediaAsSticker: true})
        message.react('✅')
    }
}
