import { randint } from "./Random";
import { Message } from "whatsapp-web.js";
import WACommand from "./WACommand.base";

const shortFromChat = async (message: Message) => {
    const chat = await message.getChat();
    const messages = await chat.fetchMessages({limit: 99999999, fromMe: undefined});
    const shorts = []
    for (const message of messages) {
        if (message.body.includes("https://youtu") && message.body.includes("shorts")) {shorts.push(message)}
    }
    const randIndex = randint(0, shorts.length-1)
    const shortToSend = shorts[randIndex]
    await message.reply(shortToSend.body)
}

class ShortCommand extends WACommand {
    public static readonly commandName = "short";
    public static readonly description = "Get a Youtube short";
    public static readonly aliases: string[] = ["giveshortnow"];
    public static readonly usage = "";

    public async execute(message: Message, args: string[]) {
        if (args.length > 0) {
            switch (args[0].toLowerCase()) {
                case "here":
                    await shortFromChat(message);
            }
        }
        else {
            await message.react('❌')
            await message.reply("Random shorts disabled (google chrome is eating my RAM)")
        }
        return
        /*else {
            const Browser = await Puppeteer.launch({
                headless: false,
                executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
            });
            console.log("Browser launched! ")
            const Page = await Browser.newPage();
            try {
                await Page.goto("https://youtube.com/shorts");
                Page.waitForSelector('button[aria-label="Accept all"]')
                .then(async (AcceptAll) => await AcceptAll.click())
                await new Promise(resolve => setTimeout(resolve, 5000))
                .then(() => Page.keyboard.down("ArrowDown"))
                await new Promise(resolve => setTimeout(resolve, 3000))
                .then(() => message.reply(Page.url()))
            }
            finally {
                await Page.close(); await Browser.close();
            }
        }*/
    }
}

export {
    ShortCommand,
    shortFromChat
}