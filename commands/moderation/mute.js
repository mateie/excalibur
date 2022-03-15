const Command = require('../../classes/types/Command');
const { CommandInteraction } = require('discord.js');

module.exports = class MuteCommand extends Command {
    constructor(client, data) {
        super(client, data);

        this.permission = 'MUTE_MEMBERS';
        this.data
            .setName('mute')
            .setDescription('Mute a member')
            .addUserOption(option =>
                option
                    .setName('member')
                    .setDescription('Member who will be muted')
                    .setRequired(true)
            )
            .addStringOption(option =>
                option
                    .setName('time')
                    .setDescription('Expire date for this mute (1m, 1h, 1d)')
            )
            .addStringOption(option =>
                option
                    .setName('reason')
                    .setDescription('Reason to why mute this person')
            );
    }

    /**
    *
    * @param {CommandInteraction} interaction
    */
    async run(interaction) {
        const { guild, options } = interaction;
        const member = options.getMember('member');
        const time = options.getString('time');
        const reason = options.getString('reason') || 'No reason specified';

        if (member.user.bot) return interaction.reply({ content: 'That member is a bot', ephemeral: true });

        this.client.mutes.create(interaction, member, time, reason);
    }
}