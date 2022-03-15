const Client = require('./Client');
const WarnsDB = require('../schemas/Warn');
const { GuildMember, CommandInteraction, ButtonInteraction } = require('discord.js');

module.exports = class Warns {
    /**
     * 
     * @param {Client} client 
     */
    constructor(client) {
        this.client = client;
    }

    /**
     * 
     * @param {(CommandInteraction | ButtonInteraction)} interaction 
     * @param {GuildMember} member 
     * @param {String} reason 
     */
    async create(interaction, member, reason) {
        await WarnsDB.create({ memberId: member.id, reason, by: interaction.member.id });

        interaction.reply({ content: `${member} was warned by ${interaction.member}, Reason: **${reason}**` });
    }

    /**
     * 
     * @param {GuildMember} member 
     * @returns {Object}
     */
    async get(member) {
        const warns = await WarnsDB.findOne({ memberId: member.id }).sort({ _id: -1 });
        return warns;
    }


    /**
     * 
     * @param {GuildMember} member 
     * @returns {Array}
     */
    async getAll(member) {
        const warns = await WarnsDB.find({ memberId: member.id });
        return warns;
    }

    /**
     * 
     * @param {GuildMember} member 
     * @returns {Number} Number of warns
     */
    async totalWarns(member) {
        const warns = await this.get(member);
        return warns.length;
    }

    /**
     * 
     * @param {GuildMember} member 
     */
    async delete(member) {
        await WarnsDB.deleteOne({ memberId: member.id });
    }
}