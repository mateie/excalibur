const Command = require('../../classes/types/Command');
const { CommandInteraction } = require('discord.js');

module.exports = class WarnsCommand extends Command {
    constructor(client, data) {
        super(client, data);

        this.permission = 'VIEW_AUDIT_LOG';
        this.data
            .setName('warns')
            .setDescription('Check Warns of a member')
            .addUserOption(option =>
                option
                    .setName('member')
                    .setDescription('Member to check warns of')
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

        const warns = await this.client.warns.getAll(member);
        if (warns.length < 1) return interaction.reply({ content: 'There were no warns found', ephemeral: true });

        const mapped = warns.map(warn => `
            **Warned By**: ${guild.members.cache.get(warn.by)}
            **Reason**: ${warn.reason}
        `);

        this.client.util.pagination(interaction, mapped, `${member.user.tag}'s Warns`);
    }
}