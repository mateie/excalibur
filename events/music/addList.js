const { Queue, Playlist } = require("distube");
const MusicEvent = require(`../../classes/types/MusicEvent`);

module.exports = class AddList extends MusicEvent {
    constructor(client) {
        super(client);
        this.name = 'addList';
    }

    /**
     * 
     * @param {Queue} queue 
     * @param {Playlist} playlist 
     */
    async run(queue, playlist) {
        const songs = playlist.songs.map((song, index) =>
            `${index + 1}. ${song.name} - \`${song.formattedDuration}\``
        );
        const embed = this.client.util.embed()
            .setDescription(`
                Added \`${playlist.name}\` playlist (${playlist.songs.length}) to the queue

                ${songs}

                ${this.status(queue)}
            `);

        queue.textChannel.send({ embeds: [embed] });
    }
}