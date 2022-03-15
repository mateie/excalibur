const Client = require('./Client');
const BlocksDB = require('../schemas/Block');
const { GuildMember, Guild, CommandInteraction } = require('discord.js');
const ms = require('ms');

module.exports = class Blocks {
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
    async create(interaction, member, time, reason) {
        const lastBlock = await this.get(member);
        if (lastBlock && !lastBlock.expired) return interaction.reply({ content: 'This person is already blocked', ephemeral: true });
        const block = await BlocksDB.create({ memberId: member.id, reason, by: interaction.member.id });

        interaction.reply({ content: `${member} was blocked${time ? ` for ${time}` : ''} from using commands by ${interaction.member}, Reason: **${reason}**` });

        if (time) {
            const expireDate = Date.now() + ms(time);

            block.time = expireDate;

            await block.save();

            setTimeout(async () => {
                interaction.editReply({ content: `${member} was unblocked` }).catch(() => { });

                block.expired = true;
                await block.save();
            }, ms(time));
        }
    }

    async check(guild) {
        guild.members.cache.forEach(async member => {
            const block = await this.get(member);
            if (!block) return;
            if (block.time) {
                const timeNow = Date.now();

                if (block.time < timeNow) {
                    this.unblock(member);
                }

                const expireDate = block.time - Date.now();

                setTimeout(async () => {
                    this.unblock(member);
                }, expireDate);
            }
        })
    }

    async unblock(member) {
        const block = await this.get(member);
        block.expired = true;
        return block.save();
    }

    /**
     * 
     * @param {GuildMember} member 
     * @returns {Object}
     */
    async get(member) {
        const blocks = await BlocksDB.findOne({ memberId: member.id }).sort({ _id: -1 });
        return blocks;
    }

    /**
     * 
     * @param {GuildMember} member  
     * @returns {Array}
     */
    async getAll(member) {
        const blocks = await BlocksDB.find({ memberId: member.id }).sort({ _id: -1 });
        return blocks;
    }

    /**
     * 
     * @param {GuildMember} member Guild Member
     * @returns {Boolean} True means blocked, false means not
     */
    async isBlocked(member) {
        const block = await this.get(member);
        if (block) {
            if (block.expired) return false;
            return true;
        }
        return false;
    }


    /**
     * 
     * @param {GuildMember} member 
     */
    async delete(member) {
        await Blocks.deleteOne({ memberId: member.id });
    }
}