const Event = require(`../../../classes/types/Event`);
const { GuildMember } = require('discord.js');

module.exports = class Boosting extends Event {
    constructor(client) {
        super(client);
        this.name = 'guildMemberUpdate';
    }

    /**
     * 
     * @param {GuildMember} oldMember 
     * @param {GuildMember} newMember 
     */

    run(oldMember, newMember) {
        if (!oldMember.premiumSince && newMember.premiumSince) this.client.cards.boosterThanks(newMember);
    }
}