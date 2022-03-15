const { GuildMember, Guild } = require('discord.js');
const Client = require('./Client');

module.exports = class XP {
    /**
     * 
     * @param {Client} client 
     */
    constructor(client) {
        this.client = client;
    }

    /**
     * 
     * @param {GuildMember} member Guild Member
     * @param {Number} amount XP Amount
     * 
     */
    async giveXP(member, amount = 1) {
        const dbMember = await this.client.database.getMember(member);

        dbMember.xp += amount;
        await dbMember.save();
    }

    /**
     * 
     * @param {GuildMember} member Guild Member
     * @returns {Number} Member's XP
     */
    async getXP(member) {
        const dbMember = await this.client.database.getMember(member);

        return dbMember.xp;
    }

    /**
     * 
     * @param {Number} xp XP to calculate
     * @returns {Number} Calculated XP
     */
    calculateLevel(xp) {
        return Math.floor(0.1 * Math.sqrt(xp));
    }

    /**
     * 
     * @param {Number} xp XP to calculate
     * @returns {Number} Calculated Needed XP
     */
    calculateReqXP(xp) {
        let currentLevel = this.calculateLevel(xp);
        const nextLevel = this.calculateLevel(xp) + 1;

        let neededXP = 0;
        while (currentLevel < nextLevel) {
            neededXP++;
            currentLevel = this.calculateLevel(xp + neededXP);
        }

        return neededXP;
    }

    /**
     * 
     * @param {Number} level Level to calculate the XP for
     * @returns {Number} Calculated Needed XP for a Level
     */
    calculateXPForLevel(level) {
        let xp = 0;
        let currentLevel = 0;

        while (currentLevel != level) {
            xp++;
            currentLevel = this.calculateLevel(xp);
        }

        return xp;
    }
}