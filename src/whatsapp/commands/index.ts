import HelpCommand from "./Help";
import EveryoneCommand from "./Everyone";
import PingCommand from "./Ping";
import PongCommand from "./Pong";
import NuhuhCommand from "./Nuhuh";
import StickerifyCommand from "./Stickerify";
import ImagineCommand from "./Imagine";
import DontpingwhileifapCommand from "./Dontpingwhileifap";

const commands = [
    EveryoneCommand,
    PingCommand,
    PongCommand,
    NuhuhCommand,
    StickerifyCommand,
    DontpingwhileifapCommand,

    // NEW COMMANDS ABOVE THIS ↑↑
    // DO NOT EDIT BELOW THIS, OR COMMAND WILL BE BLACKHOLED ↓↓
    HelpCommand,
];

export {
    commands,
};

export default commands;
