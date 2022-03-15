const Command = require('../../classes/types/Command');
const { CommandInteraction } = require('discord.js');

module.exports = class ProfileCommand extends Command {
    constructor(client, data) {
        super(client, data);

        this.data
            .setName('profile')
            .setDescription('Shows your/user\'s current XP and Rank')
            .addUserOption(option =>
                option
                    .setName('member')
                    .setDescription('Who\'s profile do you want to view?')
                    .setRequired(false)
            );
    }

    /**
    *
    * @param {CommandInteraction} interaction
    */
    async run(interaction) {
        const { options, member } = interaction;
        let person = options.getMember('member');
        if (!person) person = member;
        if (person.user.bot) return interaction.reply({ content: 'That member is a bot', ephemeral: true });

        const image = await this.client.cards.getRankCard(person);
        const attachment = this.client.util.attachment(image, `rank-${member.user.username}.png`);
        interaction.reply({ files: [attachment] });
    }
}