const { Queue, Song } = require("distube");
const MusicEvent = require(`../../classes/types/MusicEvent`);

module.exports = class AddSong extends MusicEvent {
    constructor(client) {
        super(client);
        this.name = 'addSong';
    }

    /**
     * 
     * @param {Queue} queue 
     * @param {Song} song 
     */
    async run(queue, song) {
        const embed = this.client.util.embed()
            .setDescription(`
                Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user}

                ${this.status(queue)}
            `)
            .setThumbnail(song.thumbnail);

        queue.textChannel.send({ embeds: [embed] });
    }
}