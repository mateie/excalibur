const Command = require('../../classes/types/Command');
const { CommandInteraction } = require('discord.js');
const colornames = require('colornames');
const isHexColor = require('is-hex-color');

const Member = require('../../schemas/Member');

module.exports = class CardCommand extends Command {
    constructor(client, data) {
        super(client, data);

        this.data
            .setName('card')
            .setDescription('Customize your profile card')
            .addStringOption(option =>
                option
                    .setName('element')
                    .setDescription('What do you want to customize?')
                    .setRequired(true)
                    .addChoices([
                        ["Background", "background"],
                        ["Text", 'text'],
                        ["Progressbar", "progressbar"]
                    ])
            )
            .addStringOption(option =>
                option
                    .setName('color')
                    .setDescription('What color do you want it to be?')
                    .setRequired(true)
            );
    }

    /**
    *
    * @param {CommandInteraction} interaction
    */
    async run(interaction) {
        const { options, member } = interaction;

        const element = options.getString('element');
        const color = options.getString('color');

        let hex;

        if (!isHexColor(color)) hex = colornames(color);

        if (!hex) return interaction.reply({ content: `${color} doesn't exist`, ephemeral: true });

        const dbMember = await Member.findOne({ id: member.id });

        dbMember.card[element] = hex;

        await dbMember.save();

        return interaction.reply({ content: `Your Profile Card **${element}** was changed to **${color}**`, ephemeral: true });
    }
}