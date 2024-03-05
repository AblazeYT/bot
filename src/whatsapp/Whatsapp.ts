import { Client, LocalAuth } from "whatsapp-web.js";
import { generate } from "terminal-qr";

import WACommand from "./commands/WACommand.base";
import _commands from "./commands";
import Stats from "./Statistics";

export default class Whatsapp {
    public static PREFIX = "/";

    public static client: Client;
    public static commands = new Map<string, WACommand>();

    public static start() {
        console.log("Starting Whatsapp Service");

        Whatsapp.client = new Client({
            authStrategy: new LocalAuth(),
            puppeteer: { args: [ '--no-sandbox' ] }
        });

        _commands.map((command) => {
            const cmdObject = new command();
            Whatsapp.commands.set(command.commandName, cmdObject);
            console.log(`Registered ${Whatsapp.PREFIX}${command.commandName}`);

            for (const alias of command.aliases) {
                Whatsapp.commands.set(alias, cmdObject);
                console.log(` ➡  Registered alias ${Whatsapp.PREFIX}${alias}`);
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
            Stats.handleMessage(message);
            //if (message.fromMe) return;
            if (message.body.startsWith(Whatsapp.PREFIX)) {
                const args = message.body.split(" ");
                const command = args.shift()?.substring(Whatsapp.PREFIX.length);
                const cmd = this.commands.get(command?.toLowerCase() || "");

                if (!cmd) {
                    await message.reply(`*[#]* Command not found!`);
                    return;
                }

                try {await cmd.execute(message, args)}
                catch(error) {
                    const errorMessage = String(error);
                    console.log(`*[Error]*: ${errorMessage}`);
                    message.reply(`*[Error]* ${ errorMessage }`);
                }
            }
        });
    }
}