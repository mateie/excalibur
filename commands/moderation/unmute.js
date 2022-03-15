const Command = require('../../classes/types/Command');
const { CommandInteraction } = require('discord.js');

module.exports = class UnmuteCommand extends Command {
    constructor(client, data) {
        super(client, data);

        this.permission = 'MUTE_MEMBERS';
        this.data
            .setName('unmute')
            .setDescription('Unmute')
            .addUserOption(option =>
                option
                    .setName('member')
                    .setDescription('Member who will be muted')
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

        const isMuted = await this.client.mutes.isMuted(member);

        if (!isMuted) return interaction.reply({ content: `${member} is not muted`, ephemeral: true });

        this.client.mutes.unmute(member);

        interaction.reply({ content: `${member} is unmuted` });
    }
}