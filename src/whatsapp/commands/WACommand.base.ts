import { Message } from "whatsapp-web.js";

import type WhatsApp from "../Whatsapp";

export default abstract class WACommand {
    constructor(public client: WhatsApp) {}
    public abstract execute(message: Message, args: string[]): Promise<void>;

    public getClient() {
        return this.client;
    }
}