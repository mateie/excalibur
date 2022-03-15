const { GuildMember, WebhookClient } = require('discord.js');
const Event = require(`../../../classes/types/Event`);
const { goodbyer } = require('../../../data/webhooks');

module.exports = class GuildMemberRemove extends Event {
    constructor(client) {
        super(client);

        this.name = 'guildMemberRemove';
    }

    /**
     * 
     * @param {GuildMember} member 
     */
    run(member) {
        const { user, guild } = member;

        const Goodbyer = new WebhookClient({
            id: goodbyer.id,
            token: goodbyer.token,
        });

        const avatar = user.avatarURL({ dynamic: true, size: 512 });

        const goodbye = this.client.util.embed()
            .setAuthor({ name: user.tag, iconURL: avatar })
            .setThumbnail(avatar)
            .setDescription(`
                ${member} left **${guild.name}** :<\n
                Joined: <t:${parseInt(member.joinedTimestamp / 1000)}:R>\nLatest Member Count: **${guild.memberCount}**

                ***Don't forget to read the rules***
            `);


        Goodbyer.send({ embeds: [goodbye] });
    }
}