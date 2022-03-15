const MessageMenu = require('../../classes/types/MessageMenu');
const { ContextMenuInteraction } = require('discord.js');

module.exports = class PlaySongMenu extends MessageMenu {
    constructor(client, data) {
        super(client, data);

        this.data
            .setName('Queue Song')
    }

    /**
    *
    * @param {ContextMenuInteraction} interaction
    */
    async run(interaction) {
        const { targetId, member, guild, channel } = interaction;
        const message = await channel.messages.fetch(targetId);
        const voiceChannel = member.voice.channel;

        if (message.content < 1) return interaction.reply({ content: 'Song not provided', ephemeral: true });

        if (!voiceChannel) return interaction.reply({ content: 'You must be in a voice channel to queue song', ephemeral: true });
        if (guild.me.voice.channelId && voiceChannel.id !== guild.me.voice.channelId)
            return interaction.reply({ content: `You have to be in ${guild.me.voice.channel} to queue a song`, ephemeral: true });

        this.client.music.play(voiceChannel, message.content, { textChannel: channel, member });
        return interaction.reply({ content: 'Song request received', ephemeral: true });
    }
}