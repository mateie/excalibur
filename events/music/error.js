const { TextChannel } = require("discord.js");
const MusicEvent = require(`../../classes/types/MusicEvent`);

module.exports = class Error extends MusicEvent {
    constructor(client) {
        super(client);
        this.name = 'error';
    }

    /**
     * 
     * @param {TextChannel} channel 
     * @param {Error} error 
     */
    async run(channel, error) {
        channel.send({ content: `An error encountered: ${error.toString().slice(0, 1974)}` });
        console.error(error);
    }
}