const Event = require(`../../../classes/types/Event`);

module.exports = class Ready extends Event {
    constructor(client) {
        super(client);
        this.name = 'ready';
        this.once = true;
    }

    async run() {
        console.log(`Ready! Logged in as ${this.client.user.tag}`);
        const guild = this.client.guilds.cache.first();
        this.client.commandHandler.deploy();
        this.client.database.connect();
        await this.client.database.checkMembers(guild);
        await this.client.database.checkGuilds();

        setInterval(() => {
            this.client.mutes.check(guild);
            this.client.blocks.check(guild);
        }, 50000)

        guild.members.cache.filter(member => !member.user.bot).forEach(member => this.client.valorant.login(member));

        this.client.user.setPresence({
            activities: [
                { name: 'S&B', type: 'LISTENING' }
            ],
            status: 'online'
        });
    }
}