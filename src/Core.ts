import { logger } from "./logging";
import Whatsapp from "./whatsapp/Whatsapp";

export default class Core {
    private static instance: Core;

    private whatsapp: Whatsapp;

    public static init() {
        Core.instance = new Core();

        Core.instance.start();

        return Core.instance;
    }

    private constructor() {
        logger.info("Starting Bot");
        this.whatsapp = new Whatsapp(this);
    }

    public start() {
        return this.whatsapp.start();
    }
}