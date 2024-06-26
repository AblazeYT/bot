import { Message } from "whatsapp-web.js";
import WACommand from "./WACommand.base";

function randint(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

class RandomCommand extends WACommand {
    public static readonly commandName = "random";
    public static readonly description = "Generate a random number!";
    public static readonly aliases: string[] = ["rand", "randint", "randomnumber"];
    public static readonly usage = "[min] [max]";

    public async execute(message: Message, args: string[]) {
        if (args.length === 0) {
            message.reply(randint(1, 1000000000).toString())
        }
        else {
            const min: number = parseFloat(args[0])
            const max: number = parseFloat(args[1])
            if (Number.isInteger(min) && Number.isInteger(max)) {
                const randomNumber: number = randint(min, max)
                message.reply(`Your number is ${randomNumber.toString()}!`)
            }
            else {
                message.reply("Invalid numbers!")
            }
        }
        
        return
    }
}

export {
    RandomCommand,
    randint,
}