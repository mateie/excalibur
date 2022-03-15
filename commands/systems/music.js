const Command = require('../../classes/types/Command');
const { CommandInteraction } = require('discord.js');

module.exports = class MusicCommand extends Command {
    constructor(client, data) {
        super(client, data);

        this.data
            .setName('music')
            .setDescription('Music Player')
            .addSubcommand(subcommand =>
                subcommand
                    .setName('play')
                    .setDescription('Play a song')
                    .addStringOption(option =>
                        option
                            .setName('query')
                            .setDescription('Song URL or a name')
                            .setRequired(true)
                    )
            )
            .addSubcommand(subcommand =>
                subcommand
                    .setName('volume')
                    .setDescription('Alter the volume')
                    .addNumberOption(option =>
                        option
                            .setName('percent')
                            .setDescription('50 = 50')
                            .setRequired(true)
                    )
            )
            .addSubcommand(subcommand =>
                subcommand
                    .setName('actions')
                    .setDescription('Music Player Actions')
                    .addStringOption(option =>
                        option
                            .setName('action')
                            .setDescription('Select an action')
                            .setRequired(true)
                            .addChoices([
                                ['📃 View Queue', 'queue'],
                                ["⏭ Skip Song", "skip"],
                                ["⏸ Pause Music", "pause"],
                                ["▶️ Resume Music", "resume"],
                                ["⏹ Stop Music", 'stop'],
                                ["🔀 Shuffle Queue", 'shuffle'],
                                ['🔣Toggle Autoplay Modes', 'autoPlay'],
                                ['⏯Add a Related Song', 'relatedSong'],
                                ['🔁Toggle Repeat Mode', 'repeatMode'],
                            ])
                    )
            );
    }

    /**
    *
    * @param {CommandInteraction} interaction
    */
    async run(interaction) {
        const { options, member, guild, channel } = interaction;
        const voiceChannel = member.voice.channel;

        if (!voiceChannel) return interaction.reply({ content: 'You must be in a voice channel to be able to use the music commands', ephemeral: true });

        if (guild.me.voice.channelId && voiceChannel.id !== guild.me.voice.channelId)
            return interaction.reply({ content: `I'm already playing music in ${guild.me.voice.channel}`, ephemeral: true });

        try {
            switch (options.getSubcommand()) {
                case "play": {
                    this.client.music.play(voiceChannel, options.getString('query'), { textChannel: channel, member });
                    return interaction.reply({ content: "Song request received", ephemeral: true });
                }
                case "volume": {
                    const volume = options.getNumber('percent');
                    if (volume > 100 || volume < 1) return interaction.reply({ content: 'Volume should be between 1-100', ephemeral: true });
                    this.client.music.setVolume(voiceChannel, volume);
                    return interaction.reply({ content: `🔊 volume has been set to \`${volume}\`` });
                }
                case "actions": {
                    const queue = await this.client.music.getQueue(voiceChannel);

                    if (!queue) return interaction.reply({ content: '🎵 Music is not playing' });

                    switch (options.getString("action")) {
                        case "skip":
                            await queue.skip(voiceChannel);
                            return interaction.reply({ content: '⏭ Song has been skipped' });
                        case "stop":
                            await queue.stop(voiceChannel);
                            return interaction.reply({ content: '⏹ Music has been stopped' });
                        case "pause":
                            await queue.pause(voiceChannel);
                            return interaction.reply({ content: '⏸ Music has been paused' });
                        case "resume":
                            await queue.resume(voiceChannel);
                            return interaction.reply({ content: '⏭ Music has been resumed' });
                        case "queue":
                            return interaction.reply({
                                embeds: [
                                    this.client.util.embed()
                                        .setDescription(`${queue.songs.map((song, id) => `\n(**${id + 1}**) ${song.name} - \`${song.formattedDuration}\``)}`)
                                ]
                            });
                        case "shuffle":
                            await queue.shuffle(voiceChannel);
                            return interaction.reply({ content: 'Queue has been shuffled' });
                        case "autoPlay":
                            const mode = await queue.toggleAutoplay(voiceChannel);
                            return interaction.reply({ content: `Autoplay mode is set to ${mode ? 'On' : 'Off'}` });
                        case "relatedSong":
                            await queue.addRelatedSong(voiceChannel);
                            return interaction.reply({ content: 'Added a related song' });
                        case "autoPlay":
                            const repeat = await queue.repeatMode(voiceChannel);
                            return interaction.reply({ content: `Repeat mode is set to ${repeat = repeat ? repeat == 2 ? '🔁Queue' : '🔂Song' : 'Off'}` });
                    }
                    return;
                }

            }
        } catch (e) {
            const errorEmbed = this.client.util.embed()
                .setColor('RED')
                .setDescription(`Error: ${e} `);

            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    }
}