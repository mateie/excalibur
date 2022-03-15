const { CommandInteraction } = require('discord.js');
const Block = require('../../../schemas/Block');
const Event = require(`../../../classes/types/Event`);

module.exports = class InteractionCreate extends Event {
    constructor(client) {
        super(client);
        this.name = 'interactionCreate';
    }

    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async run(interaction) {
        const { commandName, member, guild } = interaction;
        const isBlocked = await this.client.blocks.isBlocked(member);
        if (isBlocked) {
            const block = await this.client.blocks.get(member);
            const blocker = await guild.members.fetch(block.by);
            return interaction.reply({ content: `You have been blocked from using commands by ${blocker}`, ephemeral: true });
        }

        if (interaction.isCommand()) {
            const command = this.client.commands.get(commandName);
            if (!command) return interaction.reply('An error occured') && this.client.commands.delete(commandName);

            command.run(interaction);
        }

        if (interaction.isContextMenu()) {
            const menu = this.client.menus.get(commandName);
            if (!menu) return interaction.reply('An error occured') && this.client.menus.delete(commandName);

            menu.run(interaction);
        }
    }
}