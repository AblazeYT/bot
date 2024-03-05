import { Message, MessageMedia } from "whatsapp-web.js";
import { shortFromChat } from "./Short";
import WACommand from "./WACommand.base";

const car = MessageMedia.fromFilePath("./assets/car.jpg");

export default class SpawnCommand extends WACommand {
    public static readonly commandName = "spawn";
    public static readonly description = "Spawn something!";
    public static readonly aliases: string[] = ["summon"];
    public static readonly usage = "spawn [thing]";

    public async execute(message: Message, args: string[]) {
        if (args.length === 0) {
            message.reply("You can't spawn nothing! ")
        }
        else {
            switch (args[0].toLowerCase()) {
                case "car":
                    message.reply(car, undefined, { caption: "hey look at this cool car i found" });
                    break
                case "short":
                    await shortFromChat(message);
                    break
                default:
                    message.reply("You can't spawn that! ")
            }
        }
        return
    }
}