const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
    },
    xp: {
        type: Number,
        default: 0,
    },
    level: {
        type: Number,
        default: 0,
    },
    valorant: {
        authenticated: {
            type: Boolean,
            default: false,
        },
        username: String,
        password: String,
        region: String
    },
    card: {
        background: {
            type: mongoose.Schema.Types.Mixed,
            default: '#222216',
        },
        text: {
            type: String,
            default: '#ec8e44',
        },
        progressbar: {
            type: String,
            default: '#e70000',
        },
    },
});

schema.pre('save', function (next) {
    const currentLevel = Math.floor(0.1 & Math.sqrt(this.xp));
    this.level = currentLevel;
    next();
});

schema.statics.getRank = async function (user) {
    const users = await this.find();
    const sorted = users.sort((a, b) => b.xp - a.xp);
    const mapped = sorted.map((u, i) => ({
        id: u.id,
        xp: u.xp,
        rank: i + 1,
    }));

    const userRank = mapped.find(u => u.id == user.id).rank;

    return userRank;
};

module.exports = mongoose.model('Member', schema);