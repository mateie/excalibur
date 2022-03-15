const MemberMenu = require('../../classes/types/MemberMenu');
const { ContextMenuInteraction } = require('discord.js');

module.exports = class MemberInfoMenu extends MemberMenu {
    constructor(client, data) {
        super(client, data);

        this.data
            .setName('Member Info');
    }

    /**
    *
    * @param {ContextMenuInteraction} interaction
    */
    async run(interaction) {
        const member = await interaction.guild.members.fetch(interaction.targetId);

        if (member.user.bot) return interaction.reply({ content: 'That Member is A Bot', ephemeral: true });

        const avatar = member.user.avatarURL({ dynamic: true });
        const activities = [];
        const status = {
            emoji: ':white_circle:',
            text: 'Offline'
        };

        if (member.presence) {
            member.presence.activities.forEach(act => {
                const type = `***${act.type.charAt(0).toUpperCase() + act.type.split('_').join(' ').slice(1).toLowerCase()}***:`;

                activities.push(`
                ${type} ${act.state ? this.client.util.list(act.state.split('; ')) : ''} ${act.type === 'PLAYING' ? act.name : ''} ${act.type === 'LISTENING' ? '-' : ''} ${act.details ? act.details : ''}
            `);
            });

            status.emoji = this.client.util.statusEmoji(member.presence.status);
            status.text = member.presence.status !== 'dnd' ? `${member.presence.status.charAt(0).toUpperCase()}${member.presence.status.slice(1)}` : 'Do Not Disturb';
        }

        const roles = member.roles.cache.filter(role => role.name !== '@everyone');
        const mappedRoles = roles.map(role => this.mentionRole(role.id)).join(', ');

        const embed = this.client.util.embed()
            .setAuthor({ name: member.user.tag, url: avatar, iconURL: avatar })
            .setColor(member.displayHexColor)
            .setURL(avatar)
            .setThumbnail(avatar)
            .setDescription(`** Status **: ${status.emoji} ${status.text} ${activities.length > 0 ? `\n**Activities**: ${activities.join('')}` : ''}`)
            .addFields([
                { name: 'ID', value: member.id },
                { name: 'Joined Server', value: `${this.client.moment(member.joinedAt).toString().substr(0, 15)} (${this.client.moment(member.joinedAt).fromNow()})`, inline: true },
                { name: 'Joined Discord', value: `${this.client.moment(member.user.createdAt).toString().substr(0, 15)} (${this.client.moment(member.user.createdAt).fromNow()})`, inline: true },
                { name: `Roles (${roles.size})`, value: mappedRoles }
            ]);

        interaction.reply({ embeds: [embed], ephemeral: true });
    }
}