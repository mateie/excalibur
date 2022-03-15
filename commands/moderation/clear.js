const Command = require('../../classes/types/Command');
const { CommandInteraction } = require('discord.js');

module.exports = class ClearCommand extends Command {
    constructor(client, data) {
        super(client, data);

        this.data
            .setName('clear')
            .setDescription('Clear the chat')
            .addNumberOption(option =>
                option
                    .setName('amount')
                    .setDescription('Amount of messages')
                    .setRequired(true)
            )
            .addUserOption(option =>
                option
                    .setName('target')
                    .setDescription('Target to clear their messages')
                    .setRequired(false)
            );
    }

    /**
    *
    * @param {CommandInteraction} interaction
    */
    async run(interaction) {
        const { channel, options } = interaction;

        const amount = options.getNumber('amount');
        const target = options.getMember('target');

        let messages = await channel.messages.fetch({ limit: amount });

        const embed = this.client.util.embed();

        if (target) {
            messages = messages.filter(m => m.author.id == target.id);

            await channel.bulkDelete(messages, true).then(messages => {
                embed.setDescription(`✔ Cleared ${messages.size} from ${target} in this channel`);
                return interaction.reply({ embeds: [embed] });
            });

            return;
        }

        await channel.bulkDelete(amount, true).then(messages => {
            embed.setDescription(`✔ Cleared ${messages.size} from this channel`);
            return interaction.reply({ embeds: [embed] });
        });
    }
}