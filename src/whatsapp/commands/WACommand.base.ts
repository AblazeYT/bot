import { Message } from "whatsapp-web.js";

export default abstract class WACommand {
    constructor() {}
    public abstract execute(message: Message, args: string[]): Promise<void>;
}