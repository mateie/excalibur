const { GuildMember, WebhookClient } = require('discord.js');
const Event = require(`../../../classes/types/Event`);
const { welcomer } = require('../../../data/webhooks');

module.exports = class GuildMemberAdd extends Event {
    constructor(client) {
        super(client);

        this.name = 'guildMemberAdd';
    }

    /**
     * 
     * @param {GuildMember} member 
     */
    run(member) {
        const { user, guild } = member;

        const Welcomer = new WebhookClient({
            id: welcomer.id,
            token: welcomer.token
        });

        const avatar = user.avatarURL({ dynamic: true });

        const welcome = this.client.util.embed()
            .setAuthor({ name: user.tag, iconURL: avatar })
            .setThumbnail(avatar)
            .setDescription(`
                Welcome ${member} to **${guild.name}** :>

                Account Created: <t:${parseInt(user.createdTimestamp / 1000)}:R>
                Latest Member Count: **${guild.memberCount}**

                ***Don't forget to read the rules***!
            `);

        Welcomer.send({ embeds: [welcome] });
    }
}