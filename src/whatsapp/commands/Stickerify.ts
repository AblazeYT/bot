import { Message, MessageMedia } from "whatsapp-web.js";
import WACommand from "./WACommand.base";
import Whatsapp from "../Whatsapp";

export default class StickerifyCommand extends WACommand {
    public static readonly commandName = "stickerify";
    public static readonly description = "Turn any image into a sticker!";
    public static readonly aliases: string[] = ["sticker", "stick"];
    public static readonly usage = "/stickerify [attach: image]";

    constructor(whatsapp: Whatsapp) {
        super(whatsapp);
    }

    public async execute(message: Message, args: string[]) {
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
        message.reply(image, chat.id._serialized, {sendMediaAsSticker: true})
    }
}