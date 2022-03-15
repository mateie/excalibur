const { Queue } = require("distube");
const MusicEvent = require(`../../classes/types/MusicEvent`);

module.exports = class Empty extends MusicEvent {
    constructor(client) {
        super(client);
        this.name = 'empty';
    }

    /**
     * 
     * @param {Queue} queue 
     */
    async run(queue) {
        queue.textChannel.send({ content: 'There\'s no one in the voice channel, leaving it...' });
    }
}