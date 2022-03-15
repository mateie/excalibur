const { model, Schema } = require('mongoose');

const schema = new Schema({
    ticketId: String,
    guildId: String,
    memberId: String,
    channelId: String,
    closed: Boolean,
    locked: Boolean,
    type: String,
});

module.exports = model('Ticket', schema);