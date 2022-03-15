const Client = require('./Client');
const MutesDB = require('../schemas/Mute');
const roles = require('../data/roles');
const { GuildMember, Guild, CommandInteraction } = require('discord.js');
const ms = require('ms');

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
     * @param {CommandInteraction} interaction 
     * @param {GuildMember} member 
     * @param {String} time 
     * @param {String} reason 
     */
    async create(interaction, member, time, reason = 'No reason specified') {
        const lastMute = await this.get(member);
        if (lastMute && !lastMute.expired) return interaction.reply({ content: 'This person is already muted', ephemeral: true });
        const mute = await MutesDB.create({ memberId: member.id, reason, by: interaction.member.id });
        const mutedRole = interaction.guild.roles.cache.get(roles.muted);

        member.roles.add(mutedRole);

        interaction.reply({ content: `${member} was muted${time ? ` for ${time}` : ''} by ${interaction.member}, Reason: **${reason}**` });

        if (time) {
            const expireDate = Date.now() + ms(time);

            mute.time = expireDate;

            await mute.save();

            setTimeout(async () => {
                interaction.editReply({ content: `${member} was unmuted` }).catch(() => { });

                mute.expired = true;
                await mute.save();
            }, ms(time));
        }
    }

    /**
     * 
     * @param {Guild} guild 
     */
    async check(guild) {
        guild.members.cache.forEach(async member => {
            const mute = await this.get(member);
            if (!mute) return;
            if (mute.time) {
                const timeNow = Date.now();

                if (mute.time < timeNow) {
                    this.unmute(member);
                }

                const expireDate = mute.time - Date.now();

                setTimeout(async () => {
                    this.unmute(member);
                }, expireDate);
            }
        });
    }

    /**
     * 
     * @param {GuildMember} member 
     */
    async unmute(member) {
        const mutedRole = member.guild.roles.cache.get(roles.muted);
        member.roles.remove(mutedRole);
        const mute = await this.get(member);
        mute.expired = true;
        return mute.save();
    }

    async isMuted(member) {
        const mute = await this.get(member);
        if (mute) {
            if (mute.expired) return false;
            return true;
        }
        return false;
    }

    /**
     * 
     * @param {GuildMember} member 
     * @returns {Object}
     */
    async get(member) {
        const mutes = await MutesDB.findOne({ memberId: member.id }).sort({ _id: -1 });
        return mutes;
    }

    /**
     * 
     * @param {GuildMember} member 
     * @returns {Array}
     */
    async getAll(member) {
        const mutes = await MutesDB.find({ memberId: member.id }).sort({ _id: -1 });
        return mutes;
    }

    /**
     * 
     * @param {GuildMember} member 
     * @returns {Number} Number of warns
     */
    async fetchAllReasons(member) {
        const mutes = this.get(member);
        return mutes.map(mute => mute.reason);
    }

    /**
     * 
     * @param {Guild} guild 
     */

    /**
     * 
     * @param {GuildMember} member 
     */
    async delete(member) {
        await MutesDB.deleteOne({ memberId: member.id });
    }
}