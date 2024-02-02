const fs = require("fs");
import { Message, Chat } from "whatsapp-web.js";

export default class Statistics {
    private static path = "src/whatsapp/statistics.json";
    private static jsonTemplate = '{\n    "chats": {\n    }\n}'
    private static statVersion = 1.0
    private static initTemplate = {
        "messagesSent": 0,
        "timeStartedCounting": null,
        "mentions": 0,
        "statVersion": this.statVersion,
    };

    public static async read() {
        if (!fs.existsSync(Statistics.path)) {
            fs.writeFileSync(Statistics.path, "");
        }
        let file: string = await fs.readFileSync(Statistics.path, "utf8");
        if (file.length == 0) {
            file = Statistics.jsonTemplate;
            fs.writeFileSync(Statistics.path, Statistics.jsonTemplate, {encoding: "utf8"});
        }
        return await JSON.parse(file);
    }

    public static async readChat(chat: Chat) {
        const chatId: string = chat.id._serialized;
        const data = await Statistics.read();
        if (chatId in data.chats) {return data.chats[chatId]}
        else {return null}
    }
    
    public static async write(newData) {
        const jsonData: string = JSON.stringify(newData);
        await fs.writeFileSync(Statistics.path, jsonData, {encoding: "utf8"});
        return newData;
    }

    public static async initChat(chat: Chat) {
        const chatData = await Statistics.readChat(chat);
        let newData = chatData
        if (newData == null) {
            newData = Statistics.initTemplate
            newData["timeStartedCounting"] = new Date().toJSON();
            await Statistics.writeChat(chat, newData);
        }
        else if (!("statVersion" in newData) || newData["statVersion"] != this.statVersion) {
            newData = Statistics.initTemplate
            for (let property in newData) {
                if (!(property.toString() in this.initTemplate)) {delete newData[property]}
                else {newData[property] = chatData[property]}
            }
            newData["timeStartedCounting"] = new Date().toJSON();
            newData["statVersion"] = this.statVersion;
            await Statistics.writeChat(chat, newData);
        }
        return newData;
    }

    public static async writeChat(chat: Chat, newData) {
        const chatId = chat.id._serialized;
        let data = await Statistics.read();
        data.chats[chatId] = newData;
        return await Statistics.write(data);
    }

    public static async updateStatistic(chat: Chat, stat: string, newValue: number) {
        const chatId = chat.id._serialized;
        const data = await Statistics.initChat(chat);
        data[stat] = newValue;
        return await Statistics.writeChat(chat, data);
    }

    public static async incrementStatistic(chat: Chat, stat: string, incrementBy: number) {
        const chatId = chat.id._serialized;
        const data = await Statistics.initChat(chat);
        data[stat] += incrementBy;
        return await Statistics.writeChat(chat, data);
    }

    public static async handleMessage(message: Message) {
        const chat = await message.getChat();
        const mentions = await message.getMentions()
        Statistics.incrementStatistic(chat, "messagesSent", 1);
        Statistics.incrementStatistic(chat, "mentions", mentions.length)
    }
}