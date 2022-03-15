const Command = require('../../classes/types/Command');
const { CommandInteraction } = require('discord.js');

module.exports = class EmitCommand extends Command {
    constructor(client, data) {
        super(client, data);

        this.permission = 'ADMINISTRATOR';
        this.data
            .setName('emit')
            .setDescription('Event Emitter')
            .addStringOption(option =>
                option
                    .setName('member')
                    .setDescription('Guild Member')
                    .addChoices([
                        ['guildMemberAdd', 'guildMemberAdd'],
                        ['guildMemberRemove', 'guildMemberRemove']
                    ])
                    .setRequired(true)
            );
    }

    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    run(interaction) {
        const { options, member } = interaction;
        const choices = options.getString('member');
        switch (choices) {
            case 'guildMemberAdd':
                this.client.emit('guildMemberAdd', member);
                break;
            case 'guildMemberRemove':
                this.client.emit('guildMemberRemove', member);
                break;
        }

        interaction.reply({ content: 'Emitted', ephemeral: true });
    }
}