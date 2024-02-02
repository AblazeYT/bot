import HelpCommand from "./Help";
import EveryoneCommand from "./Everyone";
import PingCommand from "./Ping";
import PongCommand from "./Pong";
import NuhuhCommand from "./Nuhuh";
import StickerifyCommand from "./Stickerify";
import DontpingwhileifapCommand from "./Dontpingwhileifap";
import FireintheholeCommand from "./Fireinthehole";
import BurgerkingCommand from "./Burgerking";
import RandomCommand from "./Random";
import UnstickerifyCommand from "./Unstickerify";
import SpawnCommand from "./Spawn";
import YuhuhCommand from "./Yuhuh";
import AlfieCommand from "./Alfieelliott";
import StatsCommand from "./Stats";

const commands = [
    EveryoneCommand,
    PingCommand,
    PongCommand,
    NuhuhCommand,
    StickerifyCommand,
    DontpingwhileifapCommand,
    FireintheholeCommand,
    BurgerkingCommand,
    RandomCommand,
    UnstickerifyCommand,
    SpawnCommand,
    YuhuhCommand,
    AlfieCommand,
    StatsCommand,
    // NEW COMMANDS ABOVE THIS ↑↑
    // DO NOT EDIT BELOW THIS, OR COMMAND WILL BE BLACKHOLED ↓↓
    HelpCommand,
];

export {
    commands,
};

export default commands;