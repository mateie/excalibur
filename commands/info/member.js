const Command = require('../../classes/types/Command');
const { CommandInteraction } = require('discord.js');

module.exports = class MemberCommand extends Command {
    constructor(client, data) {
        super(client, data);

        this.data
            .setName('member')
            .setDescription('Information about a user')
            .addUserOption(option =>
                option
                    .setName('member')
                    .setDescription('Which user\'s information do you want to view')
                    .setRequired(false)
            );
    }

    /**
    *
    * @param {CommandInteraction} interaction
    */
    async run(interaction) {
        const { options, member } = interaction;
        let person = options.getMember('member');
        if (!person) person = member;
        if (person.user.bot) return interaction.reply({ content: 'That member is a bot', ephemeral: true });

        const avatar = person.user.avatarURL({ dynamic: true });
        const activities = [];
        const status = {
            emoji: ':white_circle:',
            text: 'Offline'
        };

        if (person.presence) {
            person.presence.activities.forEach(act => {
                const type = `***${act.type.charAt(0).toUpperCase() + act.type.split('_').join(' ').slice(1).toLowerCase()}***:`;

                activities.push(`
                ${type} ${act.state ? this.client.util.list(act.state.split('; ')) : ''} ${act.type === 'PLAYING' ? act.name : ''} ${act.type === 'LISTENING' ? '-' : ''} ${act.details ? act.details : ''}
            `);
            });

            status.emoji = this.client.util.statusEmoji(person.presence.status);
            status.text = member.presence.status !== 'dnd' ? `${person.presence.status.charAt(0).toUpperCase()}${person.presence.status.slice(1)}` : 'Do Not Disturb';
        }

        const roles = person.roles.cache.filter(role => role.name !== '@everyone');
        const mappedRoles = roles.map(role => this.mentionRole(role.id)).join(', ');

        const embed = this.client.util.embed()
            .setAuthor({ name: person.user.tag, url: avatar, iconURL: avatar })
            .setColor(person.displayHexColor)
            .setURL(avatar)
            .setThumbnail(avatar)
            .setDescription(`** Status **: ${status.emoji} ${status.text} ${activities.length > 0 ? `\n**Activities**: ${activities.join('')}` : ''}`)
            .addFields([
                { name: 'ID', value: person.id },
                { name: 'Joined Server', value: `${this.client.moment(person.joinedAt).toString().substr(0, 15)} (${this.client.moment(person.joinedAt).fromNow()})`, inline: true },
                { name: 'Joined Discord', value: `${this.client.moment(person.user.createdAt).toString().substr(0, 15)} (${this.client.moment(person.user.createdAt).fromNow()})`, inline: true },
                { name: `Roles (${roles.size})`, value: mappedRoles }
            ]);

        const rows = await this.client.util.memberActionRow(member, person);
        interaction.reply({ embeds: [embed], components: rows });
    }
}