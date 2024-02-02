import { Client, LocalAuth } from "whatsapp-web.js";
import { generate } from "terminal-qr";

import WACommand from "./commands/WACommand.base";
import { whatsappLogger as logger } from "../logging";
import _commands from "./commands";
import type Core from "../Core";
import Stats from "./Statistics";
export default class Whatsapp {
    public static PREFIX = "/";

    private client: Client;
    private core: Core;
    private commands = new Map<string, WACommand>();

    public getClient() {
        return this.client;
    }

    constructor(core: Core) {
        this.core = core;
        logger.info("Starting Whatsapp Service");

        this.client = new Client({
            authStrategy: new LocalAuth(),
            puppeteer: { args: [ '--no-sandbox' ] },
        });

        for (const cmdClass of _commands) {
            const cmdObj = new cmdClass(this);
            this.commands.set(cmdClass.commandName, cmdObj);
            logger.debug(`Registered command ${Whatsapp.PREFIX}${cmdClass.commandName}`);

            for (const alias of cmdClass.aliases) {
                this.commands.set(alias, cmdObj);
                logger.debug(` ➡  Registered alias ${Whatsapp.PREFIX}${alias}`);
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
        this.client.on("message_create", async (message) => {
            Stats.handleMessage(message);
            if (message.fromMe) return;
            if (message.body.startsWith(Whatsapp.PREFIX)) {
                const args = message.body.split(" ");
                const command = args.shift()?.substring(Whatsapp.PREFIX.length);

                const cmd = this.commands.get(command?.toLowerCase() || "");

                if (!cmd) {
                    await message.reply(`[#] Command not found!`);
                    return;
                }

                try {await cmd.execute(message, args)}
                catch(error) {
                    const errorMessage = String(error);
                    logger.info(errorMessage);
                    message.reply(`*Error:* ${ errorMessage }`);
                }
            }
        });
        this.client.on("message", async (message) => {
            if (message.fromMe) return;

            if (["120363203511582246@g.us"].includes(message.from)) {
                try {
                    // robot emoji
                await message.react("🤖");

                const history = await message.getChat().then(chat => chat.fetchMessages({ limit: 100 }));

                const instructions = "pretend you are a cute anime girl who talks in all lowecase, doesnt use punctuation, uses a tilda at the end of every sentence, and uses LOTS of emoticons. You are currently chatting in a Whatsapp Group Chat.";

                const resp = await this.chatgpt_generate_response(instructions, history.map(msg => {
                    return {
                        role: msg.fromMe ? "system" : "user",
                        content: msg.body,
                    };
                }));
                logger.debug(`ChatGPT Response: ${JSON.stringify(resp)}`);
                const response = resp.choices[0].message.content;
                
                await message.reply(response);
                } catch (e) {
                    logger.error(e);
                }
            }
        })
    }

    async chatgpt_generate_response(instructions: string, history: { role: "user" | "system", content: string }[]): Promise<any> {
        const data = {
            model: "gpt-3.5-turbo",
            temperature: 0.75,
            messages: [
                { role: "system", content: instructions },
            ]
        };

        if (history.length > 0) {
            data.messages.push(...history);
        }

        const res = await fetch("https://free.chatgpt.org.uk/api/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer nk-wwwchatgptorguk",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)",
            },
            body: JSON.stringify(data),
        });

        const resp = await res.json();

        return resp as any;
    }
}
