const { Message } = require("discord.js");
const Event = require(`../../../classes/types/Event`);

module.exports = class MessageCreate extends Event {
    constructor(client) {
        super(client);
        this.name = 'messageCreate';
    }

    /**
     * 
     * @param {Message} message 
     */
    async run(message) { }
}