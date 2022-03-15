const Command = require('../../classes/types/Command');
const { CommandInteraction } = require('discord.js');

module.exports = class UnblockCommand extends Command {
    constructor(client, data) {
        super(client, data);

        this.permission = 'ADMINISTRATOR';
        this.data
            .setName('unblock')
            .setDescription('Unblock a member from using commands')
            .addUserOption(option =>
                option
                    .setName('member')
                    .setDescription('Member to unblock')
                    .setRequired(true)
            );
    }

    /**
    *
    * @param {CommandInteraction} interaction
    */
    async run(interaction) {
        const { options } = interaction;

        const member = options.getMember('member');

        if (member.user.bot) return interaction.reply({ content: 'That member is a bot', ephemeral: true });

        const isBlocked = await this.client.blocks.isBlocked(member);
        if (!isBlocked) return interaction.reply({ content: 'Member is not blocked', ephemeral: true });

        await this.client.blocks.unblock(member);

        interaction.reply({ content: `${member} is now unblocked` })
    }
}