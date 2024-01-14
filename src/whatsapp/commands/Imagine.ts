import { MessageMedia, Message } from "whatsapp-web.js";
import WACommand from "./WACommand.base";
import { generate_image } from "../../common/ai/image";
import Whatsapp from "../Whatsapp";


export default class ImagineCommand extends WACommand {
    public static readonly commandName = "imagine";
    public static readonly description = "Generates an image based on the text you provide using artificial intelligence";
    public static readonly aliases = ["im"];
    public static readonly usage = "/imagine [gpt?] [prompt]";

    constructor(whatsapp: Whatsapp) {
        super(whatsapp);
    }

    public async execute(message: Message, args: string[]) {
        let prompt = args.join(" ");
        if (args[0] === "gpt") {
            prompt = args.slice(1).join(" ");

            const res = await fetch("https://gpt4.xunika.uk/api/openai/v1/chat/completions", {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer nk-wwwchatgptorguk",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)",
                },
                method: "POST",
                body: JSON.stringify({
                    model: "gpt-3.5-turbo-16k-0613",
                    temperature: 0.75,
                    messages: [
                        { role: 'system', content: "Hello. Your task is to create accurate DALL-E prompts that will create a detailed image using a prompt sent by the user. You must reply only with the exact refined prompt with lots of detail." },
                        { role: 'user', content: prompt }
                    ]
                })
            });

            let data = await res.text();
            let data2: any = {};
            try {
                data2 = JSON.parse(data);
            } catch (e) {
                console.log(e);
                await message.reply("[~] Failed to generate response (Error: 0)");
                return;
            }

            prompt = "";
            if (data2.choices) {
                const choice = data2.choices[0];
                if (choice.message) {
                    prompt = choice.message?.content;
                } else {
                    await message.reply("[~] Failed to generate response (Error: 1)");
                    return;
                }
            } else {
                await message.reply("[~] Failed to generate response (Error: 2)");
                return;
            }
        }

        if (!prompt) {
            await message.react("❓");
            return;
        }

        message.react("⏳");
        const time = Date.now();
        const image = await generate_image(prompt);
        message.react("✅");

        const latest = await message.reload();

        if (latest !== null) {
            await latest.reply(
                new MessageMedia("image/png", image.toString("base64"), "generated.png"),
                undefined,
                //@ts-ignore
                { caption: `[~] Generated image in ${Date.now() - time}ms` }
            );
        } else {
            await super.client.getClient().sendMessage(
                message.author!,
                new MessageMedia("image/png", image.toString("base64"), "generated.png"),
                //@ts-ignore
                { caption: `[~] Generated image in ${Date.now() - time}ms` }
            );
        }
    }
}