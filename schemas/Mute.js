const { model, Schema } = require('mongoose');

const schema = new Schema({
    memberId: String,
    time: String,
    by: String,
    reason: String,
    expired: {
        type: Boolean,
        default: false
    }
});

module.exports = model('Mute', schema);