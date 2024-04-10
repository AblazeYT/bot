import { Message } from "whatsapp-web.js";
import WACommand from "./WACommand.base";
import _commands from "./index";
import Whatsapp from "../Whatsapp";

export default class HelpCommand extends WACommand {
    public static readonly commandName = "help";
    public static readonly description = "Shows a list of all commands";
    public static readonly aliases = ["?"];
    public static readonly usage = "[command?]";

    private readonly commands = _commands.sort((a, b) => a.commandName.localeCompare(b.commandName));

    public async execute(message: Message, args: string[], prefix: string) {
        if (args.length === 0) {
            await message.reply(`*Bot ${process.env.npm_package_version}*\n
*Commands:*
${this.commands.map(command => `*${prefix}${command.commandName}* - ${command.description}`).join("\n")}

Debug information:
\`\`\`
${(await message.getChat()).id._serialized}`);
        } else {
            const command = this.commands.find(command => command.commandName === args[0] || command.aliases.includes(args[0] || ""));

            if (!command) {
                await message.reply(`Command not found!`);
                return;
            }

            await message.reply(`*${command.commandName}*
${command.description}\n\n${command.usage !== "" ? `*Arguments:* ${command.usage}\n` : ""}*Aliases:* ${command.aliases.map(alias => `"${alias}",`).join(" ").slice(0, -1)}`,
    undefined, {linkPreview: false, parseVCards: false}
);
        }
    }
}