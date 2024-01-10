import HelpCommand from "./Help";
import EveryoneCommand from "./Everyone";
import PingCommand from "./Ping";
import PongCommand from "./Pong";
import NuhuhCommand from "./Nuhuh";

const commands = [
    EveryoneCommand,
    PingCommand,
    PongCommand,
    NuhuhCommand,

    // NEW COMMANDS ABOVE THIS ↑↑
    // DO NOT EDIT BELOW THIS, OR COMMAND WILL BE BLACKHOLED ↓↓
    HelpCommand,
];

export {
    commands,
};

export default commands;