const { TOKEN, STEALTH, BUNZI, HYPIXEL_API } = process.env;
const { Client: DiscordClient, Collection } = require('discord.js');
const moment = require('moment');
const modals = require('discord-modals');
const Hypixel = require('hypixel-api-reborn');

const Blocks = require('./Blocks');
const Cards = require('./Cards');
const Cypher = require('./Cypher');
const Database = require('./Database');
const Music = require('./Music');
const Mutes = require('./Mutes');
const Util = require('./Util');
const Valorant = require('./games/Valorant');
const Warns = require('./Warns');
const XP = require('./XP');

const CommandHandler = require('./handlers/CommandHandler');
const EventHandler = require('./handlers/EventHandler');
const MenuHandler = require('./handlers/MenuHandler');

module.exports = class Client extends DiscordClient {
    constructor() {
        super({ intents: 32767 });

        this.owners = [STEALTH, BUNZI];

        this.commands = new Collection();
        this.menus = new Collection();
        this.moment = moment;

        this.blocks = new Blocks(this);
        this.cards = new Cards(this);
        this.cypher = new Cypher(this);
        this.database = new Database(this);
        this.hypixel = new Hypixel.Client(HYPIXEL_API);
        this.music = new Music(this);
        this.modals = modals(this);
        this.mutes = new Mutes(this);
        this.util = new Util(this);
        this.valorant = new Valorant(this);
        this.warns = new Warns(this);
        this.xp = new XP(this)

        this.commandHandler = new CommandHandler(this);
        this.eventHandler = new EventHandler(this);
        this.menuHandler = new MenuHandler(this);

        this.login(TOKEN);
    }

    init() {
        this.eventHandler.load();
        this.commandHandler.load();
        this.menuHandler.load();
        this.music.loadEvents();
    }
}