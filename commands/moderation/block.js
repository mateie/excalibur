const Command = require('../../classes/types/Command');
const { CommandInteraction } = require('discord.js');

module.exports = class BlockCOmmand extends Command {
    constructor(client, data) {
        super(client, data);

        this.permission = 'ADMINISTRATOR';
        this.data
            .setName('block')
            .setDescription('Block a member from using commands')
            .addUserOption(option =>
                option
                    .setName('member')
                    .setDescription('Member who will be blocked from using commands')
                    .setRequired(true)
            )
            .addStringOption(option =>
                option
                    .setName('time')
                    .setDescription('Expire date for this block (1m, 1h, 1d)')
            )
            .addStringOption(option =>
                option
                    .setName('reason')
                    .setDescription('Reason to why block this person')
            );
    }

    /**
    *
    * @param {CommandInteraction} interaction
    */
    async run(interaction) {
        const { options } = interaction;
        const member = options.getMember('member');
        const reason = options.getString('reason') || 'No reason specified';
        const time = options.getString('time');

        if (member.user.bot) return interaction.reply({ content: 'That member is a bot', ephemeral: true });

        this.client.blocks.create(interaction, member, time, reason);
    }
}