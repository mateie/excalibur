const { model, Schema } = require('mongoose');

const schema = new Schema({
    guildId: String,
    messageId: String,
    details: Array,
});

module.exports = model('Suggestion', schema);