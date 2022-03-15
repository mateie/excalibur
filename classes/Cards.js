const { GuildMember } = require('discord.js');
const Client = require('./Client');
const Canvas = require('canvas');
const Member = require('../schemas/Member');
const { Rank } = require('canvacord');

module.exports = class Cards {
    /**
     * 
     * @param {Client} client 
     */
    constructor(client) {
        this.client = client;
    }

    /**
     * 
     * @param {GuildMember} member 
     */
    async boosterThanks(member) {
        const { guild } = member;
        const canvas = Canvas.createCanvas(800, 250);
        const ctx = canvas.getContext('2d');

        const background = await Canvas.loadImage(`${process.cwd()}/assets/images/nitroboost.png`);
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = '#800080';
        ctx.strokeRect(0, 0, canvas.width, canvas.height);

        ctx.font = '30px cursive'
        ctx.textAlign = 'center';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(member.displayName, canvas.width / 2, canvas.height / 1.2);

        const avatar = await Canvas.loadImage(member.avatarURL({ format: 'png' }));

        ctx.beginPath();
        ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(avatar, 25, 25, 200, 200);

        const attachment = client.util.attachment(canvas.toBuffer(), "booster.png");
        const embed = client.util.embed()
            .setAuhor({ text: 'Server Boosted', iconURL: guild.iconURL({ dynamic: true, size: 512 }) })
            .setDescription('Thank you for boosting the server ^^')
            .setImage('attachment://booster.png');

        guild.systemChannel.send({ embeds: [embed], files: [attachment] }).catch(console.error);
        member.send({ embeds: [embed] });
    }

    async getCardData(member) {
        const currentXP = member.xp - this.client.xp.calculateXPForLevel(member.level);
        const neededXP = this.client.xp.calculateReqXP(member.xp) + currentXP;

        const rank = await Member.getRank(member);

        const info = {
            rank,
            level: member.level,
            neededXP,
            currentXP,
            background: member.card.background.buffer ? member.card.background.buffer : member.card.background,
            text: member.card.text,
            progressbar: member.card.progressbar
        };

        return info;
    }

    async getRankCard(member) {
        const user = await this.client.database.getMember(member);
        const cardData = await this.getCardData(user);

        const image = new Rank()
            .setBackground(Buffer.isBuffer(cardData.background) ? 'IMAGE' : 'COLOR', cardData.background)
            .setLevelColor(cardData.text)
            .setRankColor(cardData.text)
            .setAvatar(member.user.displayAvatarURL({ format: 'png' }))
            .setUsername(member.user.username)
            .setDiscriminator(member.user.discriminator)
            .setStatus(member.presence?.status ? member.presence.status : 'offline')
            .setCurrentXP(cardData.currentXP)
            .setRequiredXP(cardData.neededXP)
            .setLevel(cardData.level, 'Level')
            .setRank(cardData.rank, 'Rank')
            .renderEmojis(true)
            .setProgressBar(cardData.progressbar, 'COLOR')
            .registerFonts();

        return image.build();
    }
}