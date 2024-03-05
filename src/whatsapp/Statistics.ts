const fs = require("fs");
import { Message, Chat, Contact } from "whatsapp-web.js";
import Whatsapp from "./Whatsapp";

export default class Statistics {
    private static path = "src/whatsapp/statistics.json"
    private static jsonTemplate = '{\n    "chats": {\n    },\n    "admins": {\n    }\n}'
    private static statVersion = 1.2
    private static initTemplate = {
        "messagesSent": 0,
        "timeStartedCounting": null,
        "mentions": 0,
        "mediaSent": 0,
        "statVersion": this.statVersion,
    }

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

    public static async getAdmins() {
        const data = await Statistics.read();
        return data.admins
    }

    public static async addAdmin(contact: Contact) {
        const data = await Statistics.read();
        data.admins.push(contact.id._serialized);
        await Statistics.write(data);
        return contact
    }

    public static async removeAdmin(contact: Contact) {
        let data = await Statistics.read();
        const contactId = contact.id._serialized;
        if (contactId in data.admins) {
            data.admins.splice(data.admins.indexOf(contactId), 1);
            return contactId
        }
        else {
            return false
        }
    }

    public static async isAdmin(contact: Contact) {
        const data = await Statistics.read();
        if (contact.id._serialized in data.admins || Whatsapp.client.info.wid.user == contact.id.user) {return true}
        return false
    }

    public static async readChat(chat: Chat) {
        const chatId: string = chat.id._serialized;
        const data = await Statistics.read();
        if (chatId in data.chats) {return data.chats[chatId]}
        else {return null}
    }
    
    public static async write(newData: any) {
        const jsonData: string = JSON.stringify(newData);
        await fs.writeFileSync(Statistics.path, jsonData, {encoding: "utf8"});
        return newData;
    }

    public static async clearChats() {
        let data = await Statistics.read();
        data.splice(data.indexOf("chats"), 1)

        return await fs.writeFileSync(Statistics.path, JSON.stringify(data), {encoding: "utf8"});
    }

    public static async clearChat(chat: Chat) {
        let data = await Statistics.read();
        const chatId = chat.id._serialized
        data.chats[chatId] = this.initTemplate
        data.chats[chatId]["timeStartedCounting"] = new Date().toJSON();
        return await fs.writeFileSync(Statistics.path, JSON.stringify(data), {encoding: "utf8"});
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

    public static async writeChat(chat: Chat, newData: any) {
        const chatId = chat.id._serialized;
        let data = await Statistics.read();
        data.chats[chatId] = newData;
        return await Statistics.write(data);
    }

    public static async updateStatistic(chat: Chat, stat: string, newValue: number) {
        let data = await Statistics.initChat(chat);
        data[stat] = newValue;
        return await Statistics.writeChat(chat, data);
    }

    public static async incrementStatistic(chat: Chat, stat: string, incrementBy: number) {
        let data = await Statistics.initChat(chat);
        data[stat] += incrementBy;
        return await Statistics.writeChat(chat, data);
    }

    public static async handleMessage(message: Message) {
        const chat = await message.getChat();
        const mentions = await message.getMentions()
        Statistics.incrementStatistic(chat, "messagesSent", 1);
        Statistics.incrementStatistic(chat, "mentions", mentions.length)
        if (message.hasMedia) {Statistics.incrementStatistic(chat, "mediaSent", 1)}
    }

    public static async handleMessageDelete(message: Message) {
        try {
            const chat = await message.getChat();
            const mentions = await message.getMentions()
            Statistics.incrementStatistic(chat, "messagesSent", -1);
            Statistics.incrementStatistic(chat, "mentions", -mentions.length)
            if (message.hasMedia) {Statistics.incrementStatistic(chat, "mediaSent", -1)}
        }
        catch (error) {
            return
        }
    }
}