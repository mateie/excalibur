const MusicEvent = require(`../../classes/types/MusicEvent`);
const { Queue, Song } = require('distube')

module.exports = class PlaySong extends MusicEvent {
    constructor(client) {
        super(client);
        this.name = 'playSong';
    }

    /**
     * 
     * @param {Queue} queue 
     * @param {Song} song 
     */
    async run(queue, song) {
        const embed = this.client.util.embed()
            .setDescription(`
                Playing \`${song.name}\` - \`${song.formattedDuration}\`
                Requested by: ${song.user}
                
                ${this.status(queue)}
            `)
            .setThumbnail(song.thumbnail);

        queue.textChannel.send({ embeds: [embed] })
    }
}