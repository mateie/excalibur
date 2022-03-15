const { ButtonInteraction } = require('discord.js');
const Event = require(`../../../classes/types/Event`);
const roles = require('../../../data/roles');

module.exports = class AcceptRules extends Event {
    constructor(client) {
        super(client);
        this.name = 'interactionCreate';
    }

    /**
     * 
     * @param {ButtonInteraction} interaction 
     */
    async run(interaction) {
        if (!interaction.isButton()) return;

        const { customId, member } = interaction;

        if (!['accept_rules'].includes(customId)) return;

        try {

            const embed = this.client.util.embed();

            switch (customId) {
                case 'accept_rules': {
                    if (member.roles.cache.has(roles.member)) return interaction.reply({ content: 'You already a member :>', ephemeral: true });
                    member.roles.add(roles.member);
                    return interaction.reply({ content: 'You were assigned a member role, have a good stay :>', ephemeral: true });
                }
            }
        } catch (err) {
            console.error(err);
        }
    }
}