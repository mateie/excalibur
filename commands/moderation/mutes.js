const Command = require('../../classes/types/Command');
const { CommandInteraction } = require('discord.js');

module.exports = class MutesCommand extends Command {
    constructor(client, data) {
        super(client, data);

        this.permission = 'VIEW_AUDIT_LOG';
        this.data
            .setName('mutes')
            .setDescription('Mutes')
            .addUserOption(option =>
                option
                    .setName('member')
                    .setDescription('Member')
                    .setRequired(true)
            );
    }

    /**
    *
    * @param {CommandInteraction} interaction
    */
    async run(interaction) {
        const { options, guild } = interaction;

        const member = options.getMember('member');

        if (member.user.bot) return interaction.reply({ content: 'That member is a bot', ephemeral: true });

        const mutes = await this.client.mutes.getAll(member);

        if (mutes.length < 1) return interaction.reply({ content: `There no mutes found for ${member}`, ephemeral: true });

        const mapped = mutes.map(mute => `
                    **Muted By**: ${guild.members.cache.get(mute.by)}
                    **Reason**: ${mute.reason}
                    **Expired**: ${mute.time ? 'Yes' : 'No'}
                    ${mute.time ? `**Time**: <t:${parseInt(mute.time / 1000)}:R>` : ''}
            `);


        this.client.util.pagination(interaction, mapped, `${member.user.tag}'s Mutes`, true);
    }
}