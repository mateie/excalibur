const { Message } = require("discord.js");
const MusicEvent = require(`../../classes/types/MusicEvent`);

module.exports = class SearchNoResult extends MusicEvent {
    constructor(client) {
        super(client);
        this.name = 'searchNoResult';
    }

    /**
     * 
     * @param {Message} message 
     * @param {String} query 
     */
    async run(message, query) {
        message.channel.send({ content: `No result found for \`${query}\`` });
    }
}