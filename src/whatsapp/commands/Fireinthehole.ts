import { Message, MessageMedia } from "whatsapp-web.js";
import WACommand from "./WACommand.base";
import Whatsapp from "../Whatsapp";

const audio = MessageMedia.fromFilePath("./assets/fireinthehole.ogg");

export default class FireintheholeCommand extends WACommand {
    public static readonly commandName = "fireinthehole";
    public static readonly description = "which hole";
    public static readonly aliases: string[] = ["fire", "hole"];
    public static readonly usage = "/fireinthehole";

    constructor(whatsapp: Whatsapp) {
        super(whatsapp);
    }

    public async execute(message: Message, args: string[]) {
        
        await message.reply(audio, undefined, { sendAudioAsVoice: true });
        
    }
}