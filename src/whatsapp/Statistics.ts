const fs = require("fs");
import { Message, Chat, Contact } from "whatsapp-web.js";
import Whatsapp from "./Whatsapp";

export default class Statistics {
    private static path = "src/whatsapp/statistics.json"
    private static jsonTemplate = '{"chats": {}, "admins": []}'
    private static statVersion = 1.3 // increment this whenever there is an update to the template
    private static initTemplate = {
        "messagesSent": 0,
        "timeStartedCounting": null,
        "mentions": 0,
        "mediaSent": 0,
        "statVersion": this.statVersion,
        "bannedUsers": [],
    }
    // this is the template applied to chats when statistics start being counted

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

    public static async addAdmins(contacts: Contact[]) {
        const data = await Statistics.read();
        let dataToWrite = Object.assign({}, data)
        for (const contact of contacts) {dataToWrite.admins.push(contact.id._serialized)}
        await Statistics.write(dataToWrite);
    }

    public static async removeAdmins(contacts: Contact[]) {
        let data = await Statistics.read();
        for (const contact of contacts) {
            const index = data.admins.indexOf(contact.id._serialized)
            if (index != -1) {
                data.admins.splice(index, 1)
            }
        }
        await Statistics.write(data);
    }

    public static async isAdmin(contact: Contact) {
        const data = await Statistics.read();
        return (contact.id._serialized in data.admins || Whatsapp.client.info.wid._serialized == contact.id._serialized)
    }

    public static async banUser(contact: Contact, chat: Chat) {
        let data = await Statistics.readChat(chat);
        if (data.bannedUsers.indexOf(contact.id._serialized) == -1) {data.bannedUsers.push(contact.id._serialized)}
        await Statistics.write(data);
    }

    public static async unbanUser(contact: Contact, chat: Chat) {
        let data = await Statistics.readChat(chat);
        const userIndex = data.bannedUsers.indexOf(contact.id._serialized)
        if (userIndex != -1) {delete data.bannedUsers[userIndex]}
        return
    }

    public static async getBannedUsers(chat: Chat) {
        const data = await Statistics.readChat(chat);
        return data.bannedUsers
    }

    public static async readChat(chat: Chat) {
        return await Statistics.validateChat(chat);
    }
    
    public static async write(newData) {
        const jsonData: string = JSON.stringify(newData);
        await fs.writeFileSync(Statistics.path, jsonData);
        console.log((await Statistics.read()).admins)
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

    public static async validateChat(chat: Chat) {
        const data = await Statistics.read();
        let chatData = data.chats[chat.id._serialized]
        if (chatData == null) {
            chatData = Statistics.initTemplate
            chatData["timeStartedCounting"] = new Date().toJSON();
        } // We handle what happens when the chat has no data recorded
        else if (!("statVersion" in chatData) || chatData["statVersion"] != this.statVersion) {
            const newData = Statistics.initTemplate
            for (let property in chatData) {
                if (!(property.toString() in this.initTemplate)) {delete newData[property]}
                else {newData[property] = chatData[property]}
            }
            newData["timeStartedCounting"] = new Date().toJSON();
            newData["statVersion"] = this.statVersion;
            chatData = newData;
        } // checks if the version of the chat's stats is outdated - this is so that we can add new properties
        await Statistics.writeChat(chat, chatData);
        return chatData;
    }
    // I hate Statistics.ts so much

    public static async writeChat(chat: Chat, newData: any) {
        const chatId = chat.id._serialized;
        let data = await Statistics.read();
        let dataToWrite = Object.assign({}, data)
        dataToWrite.chats[chatId] = newData
        return await Statistics.write(dataToWrite);
    }

    public static async handleMessage(message: Message) {
        const chat = await message.getChat();
        const data = await Statistics.validateChat(chat)
        const mentions = await message.getMentions()
        data.messagesSent += 1
        data.mentions += mentions.length
        if (message.hasMedia) {data.mediaSent += 1}
        return await Statistics.writeChat(chat, data);
    }

    public static async handleMessageDelete(message: Message) {
        try {
            const chat = await message.getChat();
            const data = await Statistics.validateChat(chat);
            const mentions = await message.getMentions();
            data.messagesSent -= 1;
            data.mentions -= mentions.length;
            if (message.hasMedia) {data.mediaSent -= 1}
            return await Statistics.writeChat(chat, data);
        }
        catch (error) {
            return
        }
    }
}