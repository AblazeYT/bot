import { Message, MessageMedia } from "whatsapp-web.js";
import WACommand from "./WACommand.base";
import Whatsapp from "../Whatsapp";

const car = MessageMedia.fromFilePath("./assets/car.jpg");

export default class SpawnCommand extends WACommand {
    public static readonly commandName = "spawn";
    public static readonly description = "Spawn something!";
    public static readonly aliases: string[] = ["summon"];
    public static readonly usage = "/spawn [thing]";

    constructor(whatsapp: Whatsapp) {
        super(whatsapp);
    }

    public async execute(message: Message, args: string[]) {
        if (args.length === 0) {
            message.reply("You can't spawn nothing! ")
        }
        else {
            switch (args[0]) {
                case "car":
                    message.reply(car, undefined, { caption: "hey look at this cool car i found" });
                    break
                default:
                    message.reply("You can't spawn that! ")
            }
        }
        return
    }
}