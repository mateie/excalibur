const { model, Schema } = require('mongoose');

const schema = new Schema({
    guildId: String,
    channelId: String,
    time: String,
    reason: String,
});

module.exports = model('Lockdown', schema);