const Command = require('../../classes/types/Command');
const { CommandInteraction } = require('discord.js');

module.exports = class WarnCommand extends Command {
    constructor(client, data) {
        super(client, data);

        this.permission = 'ADMINISTRATOR';
        this.data
            .setName('warn')
            .setDescription('Warn a member')
            .addUserOption(option =>
                option
                    .setName('member')
                    .setDescription('Member to warn')
                    .setRequired(true)
            )
            .addStringOption(option =>
                option
                    .setName('reason')
                    .setDescription('Reason to warn this member')
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

        this.client.warns.create(interaction, member, reason);
    }
}