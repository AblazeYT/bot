import { Message, MessageMedia } from "whatsapp-web.js";
import WACommand from "./WACommand.base";

export default class StickerifyCommand extends WACommand {
    public static readonly commandName = "stickerify";
    public static readonly description = "Turn any image into a sticker!";
    public static readonly aliases: string[] = ["sticker", "stick"];
    public static readonly usage = "[attach or reply: image/video]";

    public async execute(message: Message, args: string[]) {
        message.react('⏳')
        const chat = await message.getChat()
        let image: MessageMedia
        if (message.hasMedia) {
            if (message.hasQuotedMsg) {message = await message.getQuotedMessage()}
            image = await message.downloadMedia()
        }
        else {
            message.react('❌')
            message.reply("No media attached! ")
            return
        }
        await message.reply(image, chat.id._serialized, {sendMediaAsSticker: true})
        message.react('✅')
    }
}
