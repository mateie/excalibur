const { model, Schema } = require('mongoose');

const schema = new Schema({
    memberId: String,
    time: String,
    by: String,
    reason: String,
});

module.exports = model('Warn', schema);