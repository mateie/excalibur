const { ButtonInteraction } = require("discord.js");
const Event = require(`../../../classes/types/Event`);
const Suggestions = require(`../../../schemas/Suggestion`);

module.exports = class Suggestion extends Event {
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

        const { guildId, customId, message } = interaction;

        if (!['suggest-accept', 'suggest-decline'].includes(customId)) return;

        if (!interaction.member.permissions.has('ADMINISTRATOR')) return interaction.reply({ content: 'You cannot use this button', ephemeral: true });

        try {
            const suggestion = await Suggestions.findOne({ guildId, messageId: message.id });
            if (!suggestion) return interaction.reply({ content: 'Suggestion was not found', ephemeral: true });

            const embed = message.embeds[0];
            if (!embed) return;

            switch (customId) {
                case 'suggest-accept': {
                    embed.fields[2] = { name: 'Status', value: 'Accepted', inline: true };
                    message.edit({ embeds: [embed.setColor('GREEN')], components: [] });
                    return interaction.reply({ content: 'Suggestion accepted', ephemeral: true });
                }
                case 'suggest-decline': {
                    embed.fields[2] = { name: 'Stauts', value: 'Declined', inline: true };
                    message.edit({ embeds: [embed.setColor('RED')], components: [] });
                    return interaction.reply({ content: 'Suggestion decliend', ephemeral: true });
                }
            }
        } catch (err) {
            console.error(err);
        }
    }
}