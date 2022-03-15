const Event = require(`../../../classes/types/Event`);
const { ModalSubmitInteraction } = require('discord-modals');

module.exports = class ModalSubmit extends Event {
    constructor(client) {
        super(client);
        this.name = 'modalSubmit';
    }

    /**
     * 
     * @param {ModalSubmitInteraction} interaction 
     */
    async run(interaction) {
        const { message, guild } = interaction;
        switch (interaction.customId) {
            case 'warn-member-modal':
                const warnTarget = guild.members.cache.get(message.embeds[0].fields[0].value);
                const warnReason = interaction.getTextInputValue('warn-member-reason');
                this.client.warns.create(interaction, warnTarget, warnReason);
                break;
            case 'block-member-modal':
                const blockTarget = guild.members.cache.get(message.embeds[0].fields[0].value);
                const blockReason = interaction.getTextInputValue('block-member-reason');
                const blockTime = interaction.getTextInputValue('block-member-time');
                this.client.blocks.create(interaction, blockTarget, blockTime, blockReason);
                break;
            case 'mute-member-modal':
                const muteTarget = guild.members.cache.get(message.embeds[0].fields[0].value);
                const muteReason = interaction.getTextInputValue('mute-member-reason');
                const muteTime = interaction.getTextInputValue('mute-member-time');
                this.client.mutes.create(interaction, muteTarget, muteTime, muteReason);
                break;
        }
    }
}