import { Client, LocalAuth } from "whatsapp-web.js";
import { generate } from "terminal-qr";

import WACommand from "./commands/WACommand.base";
import { whatsappLogger as logger } from "../logging";
import _commands from "./commands";
import type Core from "../Core";
export default class Whatsapp {
    private static PREFIX = "/";

    private client: Client;
    private core: Core;
    private commands = new Map<string, WACommand>();

    constructor(core: Core) {
        this.core = core;
        logger.info("Starting Whatsapp Service");

        this.client = new Client({
            authStrategy: new LocalAuth(),
        });

        for (const cmdClass of _commands) {
            const cmdObj = new cmdClass(this);
            this.commands.set(cmdClass.commandName, cmdObj);
            logger.debug(`Registered command /${cmdClass.commandName}`);

            for (const alias of cmdClass.aliases) {
                this.commands.set(alias, cmdObj);
                logger.debug(` ➡  Registered alias /${alias}`);
            }
        }
    }

    start() {
        this.registerInitListeners();
        return this.client.initialize();
    }

    registerInitListeners() {
        this.client.on("qr", (qr) => {
            logger.info("QR Code received");
            generate(qr, { small: true }, (code) => {
                console.log(code);
            });
        });
        this.client.on("ready", () => {
            logger.info(`Successfully authenticated as ${this.client.info.pushname} (${this.client.info.wid.user})`);

            this.registerRuntimeListeners();
        });

        this.client.on("authenticated", (session) => {
            logger.debug(`Authenticated with ${session?.WABrowserId} - ${session?.WASecretBundle} - ${session?.WAToken1} - ${session?.WAToken2}`)
        });
    }

    registerRuntimeListeners() {
        this.client.on("message", async (message) => {
            if (message.fromMe) return;

            if (message.body.startsWith(Whatsapp.PREFIX)) {
                const args = message.body.split(" ");
                const command = args.shift()?.substring(Whatsapp.PREFIX.length);

                const cmd = this.commands.get(command || "");
                console.log(command);

                if (!cmd) {
                    await message.reply(`[#] Command not found!`);
                    return;
                }

                await cmd.execute(message, args);
            }
        });
    }
}