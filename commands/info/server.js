const Command = require('../../classes/types/Command');
const { CommandInteraction } = require('discord.js');

module.exports = class ServerCommand extends Command {
    constructor(client, data) {
        super(client, data);

        this.data
            .setName('server')
            .setDescription('Display Server Information');
    }

    /**
    *
    * @param {CommandInteraction} interaction
    */
    run(interaction) {
        const { guild } = interaction;
        const { createdTimestamp, description, members, memberCount, channels, emojis, stickers } = guild;

        const embed = this.client.util.embed()
            .setAuthor({ name: guild.name, iconURL: guild.iconURL({ dynamic: true }) })
            .setThumbnail(guild.iconURL({ dynamic: true }))
            .addFields(
                [
                    {
                        name: 'General',
                        value: `
                            Name: ${guild.name}
                            Created: <t:${parseInt(createdTimestamp / 1000)}:R>
                            Owners: ${guild.members.cache.get(this.client.owners[0])} and ${guild.members.cache.get(this.client.owners[1])}

                            Description: ${description}
                        `
                    },
                    {
                        name: `👥| Users`,
                        value: `
                            - Members: ${members.cache.filter(m => !m.user.bot).size}
                            - Bots: ${members.cache.filter(m => m.user.bot).size}
                        
                            Total: ${memberCount}
                        `
                    },
                    {
                        name: `📃 | Channels`,
                        value: `
                            - Text: ${channels.cache.filter(ch => ch.type == 'GUILD_TEXT').size}
                            - Voice: ${channels.cache.filter(ch => ch.type == 'GUILD_VOICE').size}
                            - Threads: ${channels.cache.filter(ch => ch.type == 'GUILD_PUBLIC_THREAD' && 'GUILD_PRIVATE_THREAD' && 'GUILD_NEWS_THREAD').size}
                            - Categories: ${channels.cache.filter(ch => ch.type == 'GUILD_CATEGORY').size}
                            - Stages: ${channels.cache.filter(ch => ch.type == 'GUILD_STAGE_VOICE').size}
                            - News: ${channels.cache.filter(ch => ch.type == 'GUILD_NEWS').size}

                            Total: ${channels.cache.size}
                        `
                    },
                    {
                        name: `😯 | Emojis & Stickers`,
                        value: `
                            - Animated: ${emojis.cache.filter(e => e.animated).size}
                            - Static: ${emojis.cache.filter(e => !e.animated).size}
                            - Stickers: ${stickers.cache.size}

                            Total: ${emojis.cache.size + stickers.cache.size}
                        `
                    },
                    {
                        name: `Nitro Statistics`,
                        value: `
                            - Tier: ${guild.premiumTier.replace("TIER_", '')}
                            - Boosts: ${guild.premiumSubscriptionCount}
                            - Boosters: ${members.cache.filter(m => m.premiumSince).size}
                        `
                    }
                ]
            );

        return interaction.reply({ embeds: [embed], ephemeral: true });
    }
}