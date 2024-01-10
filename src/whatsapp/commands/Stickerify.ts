import { Message, MessageMedia } from "whatsapp-web.js";
import WACommand from "./WACommand.base";
import Whatsapp from "../Whatsapp";

export default class NuhuhCommand extends WACommand {
    public static readonly commandName = "nuhuh";
    public static readonly description = "Nuh uh!";
    public static readonly aliases: string[] = [];
    public static readonly usage = "/nuhuh";

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