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
    async run(message) {
        if (message.member.id === '376212120871763980') {
            message.delete();
            return message.channel.send({ content: `${message.member} Shut the fuck up` })
        };
    }
}