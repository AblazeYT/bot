import HelpCommand from "./Help";
import EveryoneCommand from "./Everyone";
import PingCommand from "./Ping";
import PongCommand from "./Pong";

const commands = [
    EveryoneCommand,
    PingCommand,
    PongCommand,
    HelpCommand,
];

export {
    commands,
};

export default commands;