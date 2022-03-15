const Command = require('../../classes/types/Command');
const { CommandInteraction } = require('discord.js');

module.exports = class BlocksCommand extends Command {
    constructor(client, data) {
        super(client, data);

        this.permission = 'VIEW_AUDIT_LOG';
        this.data
            .setName('blocks')
            .setDescription('Check blocks for the member')
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

        const blocks = await this.client.blocks.getAll(member);
        if (blocks.length < 1) return interaction.reply({ content: 'There were no blocks found', ephemeral: true });

        const mapped = blocks.map(block => {
            const blocker = guild.members.cache.get(block.by);
            const time = block.time ? this.client.moment(parseInt(block.time)).fromNow() : 'Indefinite';
            return `
                **Blocked by**: ${blocker}
                **Reason**: ${block.reason}
                **Expires on**: ${time}
            `;
        });

        this.client.util.pagination(interaction, mapped, `${member.user.tag}'s Blocks`);
    }
}