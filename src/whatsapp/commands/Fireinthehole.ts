import { Message, MessageMedia } from "whatsapp-web.js";
import WACommand from "./WACommand.base";
import Whatsapp from "../Whatsapp";

const audio = MessageMedia.fromFilePath("./assets/fireinthehole.opus");

export default class FireintheholeCommand extends WACommand {
    public static readonly commandName = "fireinthehole";
    public static readonly description = "which hole";
    public static readonly aliases: string[] = ["fire", "hole"];
    public static readonly usage = "fireinthehole";

    constructor(whatsapp: Whatsapp) {
        super(whatsapp);
    }

    public async execute(message: Message, args: string[]) {
        message.react('⏳')
        console.log(audio)
        await message.reply(audio, undefined, { sendAudioAsVoice: true, caption: "fire in the hole" });
        message.react('✅')
    }
}