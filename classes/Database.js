const { DB } = process.env;
const { Guild: DiscordGuild, GuildMember } = require('discord.js');
const Client = require('./Client');
const mongoose = require('mongoose');
const Guild = require('../schemas/Guild');
const Member = require('../schemas/Member');

module.exports = class Database {
    /**
     * 
     * @param {Client} client 
     */
    constructor(client) {
        this.client = client;
    }

    connect() {
        if (!DB) return console.error('Database URL not provided');
        mongoose.connect(DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).then(() => {
            console.log('Connected to the Database');
        })
            .catch(console.error);
    }

    async getMember(member) {
        const dbMember = await Member.findOne({ id: member.id });
        if (!dbMember) return await this.checkMember(member);
        return dbMember;
    }

    async checkGuilds() {
        this.client.guilds.cache.forEach(async guild => await this.checkGuild(guild));
    }

    /**
     * 
     * @param {DiscordGuild} guild Discord Guild
     */
    async checkMembers(guild) {
        guild.members.cache.forEach(async member => await this.checkMember(member));
    }

    /**
     * 
     * @param {GuildMember} member Guild Member
     */
    async checkMember(member) {
        try {
            const dbMember = await Member.findOne({ id: member.id });

            if (!member.user.bot && !dbMember) {
                const newMember = new Member({
                    id: member.id,
                    username: member.user.username,
                });

                await newMember.save();

                console.log(`Member added to the database (ID: ${member.id} - Username: ${member.user.tag})`);

                return newMember;
            }

            return dbMember;
        } catch (err) {
            console.error(err);
        }
    }

    /**
     * 
     * @param {DiscordGuild} guild Discord Guild
     */
    async checkGuild(guild) {
        try {
            const dbGuild = await Guild.findOne({ id: guild.id });

            if (!dbGuild) {
                const newGuild = new Guild({
                    id: guild.id,
                    name: guild.name
                });

                await newGuild.save();

                console.log(`Guild added to the database (ID: ${guild.id} - Name: ${guild.name})`);
            }
        } catch (err) {
            console.error(err);
        }
    }
}