import { Client, GroupChat, LocalAuth } from "whatsapp-web.js";
import { generate } from "terminal-qr";

import WACommand from "./commands/WACommand.base";
import _commands from "./commands";
import Stats from "./Statistics";

export default class Whatsapp {
    public static prefixList = ["/", "slash "];

    public static client: Client;
    public static commands = new Map<string, WACommand>();

    public start() {
        console.log("Starting Whatsapp Service");

        Whatsapp.client = new Client({
            authStrategy: new LocalAuth(),
            puppeteer: { 
                args: [ '--no-sandbox' ],
                executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
            }
        });

        _commands.map((command) => {
            const cmdObject = new command();
            Whatsapp.commands.set(command.commandName, cmdObject);
            console.log(`Registered ${command.commandName}`);

            for (const alias of command.aliases) {
                Whatsapp.commands.set(alias, cmdObject);
                console.log(` ➡  Registered alias ${alias}`);
            }
        })

        Whatsapp.registerInitListeners();
        return Whatsapp.client.initialize();
    }

    private static registerInitListeners() {
        Whatsapp.client.on("qr", (qr) => {
            console.log("QR Code received!");
            generate(qr, { small: true }, (code) => {
                console.log(code);
            });
        });
        Whatsapp.client.on("ready", () => {
            console.log(`Successfully authenticated as ${Whatsapp.client.info.pushname} (${Whatsapp.client.info.wid.user})`);

            this.registerRuntimeListeners();
        });
    }

    private static registerRuntimeListeners() {
        Whatsapp.client.on("message_create", async (message) => {
            //Stats.handleMessage(message);
            //if (message.fromMe) return;
            let prefixUsed = ""; // is the user trying to execute a command
            for (const prefix of Whatsapp.prefixList) {
                if (message.body.toLowerCase().startsWith(prefix.toLowerCase())) {
                    prefixUsed = prefix; // we might need to know the prefix they used later in commands such as help
                }
            }
            if (prefixUsed !== "") {
                let args = message.body.substring(prefixUsed.length).split(" ")
                const command = args.shift()
                let cmd = this.commands.get(command?.toLowerCase() || "");

                if (!cmd) { // this is how aliases with spaces work
                    let commandCopy = command
                    let argsCopy = args
                    while (!cmd && argsCopy.length > 0) {
                        commandCopy += ` ${argsCopy.shift()}`
                        cmd = this.commands.get(commandCopy?.toLowerCase() || "")
                    }
                    if (!cmd) {
                        await message.reply(`*[#]* Command not found!`);
                        return
                    }
                }

                try {await cmd.execute(message, args, prefixUsed)}
                catch(error) {
                    const errorMessage = String(error);
                    console.log(`*[Error]*: ${errorMessage}`);
                    message.reply(`*[Error]* ${ errorMessage }`);
                }
            }
        });
        Whatsapp.client.on("group_join", async (notification) => {
            const chat = await notification.getChat() as GroupChat;
            const contact = await notification.getContact();
            if ((await Stats.getBannedUsers(chat)).indexOf(contact.id._serialized) != -1) {
                await chat.removeParticipants([contact.id._serialized])
            }
        })
    }
}