const { ButtonInteraction } = require('discord.js');
const Event = require(`../../../classes/types/Event`);

module.exports = class MemberActions extends Event {
    constructor(client) {
        super(client);
        this.name = 'interactionCreate';
    }

    /**
     * 
     * @param {ButtonInteraction} interaction 
     */
    async run(interaction) {
        if (!interaction.isButton()) return;

        const { customId, message, guild, member } = interaction;
        if (![
            'show_card',
            'show_warns',
            'show_blocks',
            'show_mutes',
            'warn_member',
            'block_member',
            'mute_member',
            'unblock_member',
            'unmute_member'
        ].includes(customId)) return;

        const target = guild.members.cache.get(message.embeds[0].fields[0].value);

        switch (customId) {
            case `show_card`: {
                const image = await this.client.cards.getRankCard(member);
                const attachment = this.client.util.attachment(image, `rank-${member.user.username}.png`);
                return interaction.reply({ files: [attachment], ephemeral: true });
            }
            case `show_warns`: {
                if (!member.permissions.has('VIEW_AUDIT_LOG')) return interaction.reply({ content: 'Not enough permissions', ephemeral: true });
                const warns = await this.client.warns.getAll(target);
                if (warns.length < 1) return interaction.reply({ content: `${target} has no warns`, ephemeral: true });
                const mapped = warns.map(warn => `
                        **Warned By**: ${guild.members.cache.get(warn.by)}
                        **Reason**: ${warn.reason}
                    `);

                this.client.util.pagination(interaction, mapped, `${target.user.tag}'s Warns`, true);
                break;
            }
            case `show_blocks`: {
                if (!member.permissions.has('VIEW_AUDIT_LOG')) return interaction.reply({ content: 'Not enough permissions', ephemeral: true });
                const blocks = await this.client.blocks.getAll(target);
                if (blocks.length < 1) return interaction.reply({ content: `${target} has no blocks`, ephemeral: true });
                const mapped = blocks.map(block => {
                    const blocker = guild.members.cache.get(block.by);
                    const time = block.time ? this.client.moment(parseInt(block.time)).fromNow() : 'Indefinite';
                    return `
                        **Blocked by**: ${blocker}
                        **Reason**: ${block.reason}
                        **Expires on**: ${time}
                    `;
                });

                this.client.util.pagination(interaction, mapped, `${target.user.tag}'s Blocks`, true);
                break;
            }
            case `show_mutes`: {
                if (!member.permissions.has('VIEW_AUDIT_LOG')) return interaction.reply({ content: 'Not enough permissions', ephemeral: true });
                const mutes = await this.client.mutes.getAll(target);
                if (mutes.length < 1) return interaction.reply({ content: `${target} has no mutes`, ephemeral: true });
                const mapped = mutes.map(mute => {
                    const blocker = guild.members.cache.get(mute.by);
                    const time = mute.time ? this.client.moment(parseInt(mute.time)).fromNow() : 'Indefinite';
                    return `
                        **Blocked by**: ${blocker}
                        **Reason**: ${mute.reason}
                        **Expires on**: ${time}
                    `;
                });

                this.client.util.pagination(interaction, mapped, `${target.user.tag}'s Mutes`, true);
                break;
            }
            case `warn_member`: {
                if (!member.permissions.has('MODERATE_MEMBERS')) return interaction.reply({ content: 'Not enough permissions', ephemeral: true });
                const modal = this.client.util.modal()
                    .component
                    .setCustomId('warn-member-modal')
                    .setTitle(`Warning ${target.user.tag}`)
                    .addComponents([
                        this.client.util.textInput()
                            .setCustomId('warn-member-reason')
                            .setLabel('Reason for the warn')
                            .setStyle('SHORT')
                            .setMinLength(8)
                            .setMaxLength(100)
                            .setPlaceholder('Type your reason here')
                            .setRequired(true)
                    ]);

                this.client.util.modal().show(modal, { client: this.client, interaction });
                break;
            }
            case `block_member`: {
                if (!member.permissions.has('MODERATE_MEMBERS')) return interaction.reply({ content: 'Not enough permissions', ephemeral: true });
                const modal = this.client.util.modal()
                    .component
                    .setCustomId('block-member-modal')
                    .setTitle(`Blocking ${target.user.tag}`)
                    .addComponents([
                        this.client.util.textInput()
                            .setCustomId('block-member-time')
                            .setLabel('Time for the block')
                            .setStyle('SHORT')
                            .setMaxLength(8)
                            .setMaxLength(100)
                            .setPlaceholder('Type your time here (1m, 1h, 1d)')
                            .setRequired(false),
                        this.client.util.textInput()
                            .setCustomId('block-member-reason')
                            .setLabel('Reason for the block')
                            .setStyle('SHORT')
                            .setMaxLength(8)
                            .setMaxLength(100)
                            .setPlaceholder('Type your reason here')
                            .setRequired(true)
                    ]);

                this.client.util.modal().show(modal, { client: this.client, interaction });
                break;
            }
            case `mute_member`:
                if (!member.permissions.has('MODERATE_MEMBERS')) return interaction.reply({ content: 'Not enough permissions', ephemeral: true });
                const modal = this.client.util.modal()
                    .component
                    .setCustomId('mute-member-modal')
                    .setTitle(`Muting ${target.user.tag}`)
                    .addComponents([
                        this.client.util.textInput()
                            .setCustomId('mute-member-time')
                            .setLabel('Time for the mute')
                            .setStyle('SHORT')
                            .setMaxLength(8)
                            .setMaxLength(100)
                            .setPlaceholder('Type your time here (1m, 1h, 1d)')
                            .setRequired(false),
                        this.client.util.textInput()
                            .setCustomId('mute-member-reason')
                            .setLabel('Reason for the mute')
                            .setStyle('SHORT')
                            .setMaxLength(8)
                            .setMaxLength(100)
                            .setPlaceholder('Type your reason here')
                            .setRequired(true)
                    ]);

                this.client.util.modal().show(modal, { client: this.client, interaction });
                break;
            case 'unblock_member': {
                const isBlocked = await this.client.blocks.isBlocked(target);
                if (!isBlocked) return interaction.reply({ content: `${target} is already unblocked`, ephemeral: true });
                this.client.blocks.unblock(target);
                interaction.reply({ content: `${target} was unblocked` });
                break;
            }
            case 'unmute_member': {
                const isMuted = await this.client.mutes.isMuted(target);
                if (!isMuted) return interaction.reply({ content: `${target} is already unmuted`, ephemeral: true });
                this.client.mutes.unmute(target);
                interaction.reply({ content: `${target} was unmuted` });
                break;
            }
        }
    }
}