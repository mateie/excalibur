const Event = require(`../../../classes/types/Event`);
const { ButtonInteraction } = require('discord.js');
const games = require('../../../data/games');
const roles = require('../../../data/roles');

module.exports = class GameRoles extends Event {
    constructor(client) {
        super(client);
        this.name = 'interactionCreate';
    }

    /**
     * 
     * @param {ButtonInteraction} interaction 
     */
    run(interaction) {
        if (!interaction.isButton()) return;

        const { customId, guild, member } = interaction;
        if (!games.map(game => `${game}_role`).includes(customId)) return;

        const role = guild.roles.cache.get(roles.games[customId]);
        if (member.roles.cache.has(role.id)) {
            member.roles.remove(role);

            interaction.reply({ content: `${role} was removed from you :<`, ephemeral: true });
        } else {
            member.roles.add(role);

            interaction.reply({ content: `${role} was added to you :>`, ephemeral: true });
        }
    }
}