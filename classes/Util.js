const Client = require('./Client');
const { MessageEmbed, MessageAttachment, MessageActionRow, MessageButton, CommandInteraction, GuildMember } = require("discord.js");
const { Modal, TextInputComponent, showModal } = require('discord-modals');

module.exports = class Util {

    /**
     * 
     * @param {Client} client 
     */
    constructor(client) {
        this.client = client;
    }

    /**
     * 
     * @returns {MessageActionRow}
     */
    actionRow() {
        return new MessageActionRow();
    }

    /**
     * 
     * @returns {MessageButton}
     */
    button() {
        return new MessageButton();
    }

    /**
     * 
     * @returns {Object}
     */
    modal() {
        return {
            component: new Modal(),
            show: showModal
        }
    }

    /**
     * 
     * @returns {TextInputComponent}
     */
    textInput() {
        return new TextInputComponent();
    }

    /**
     * 
     * @param {GuildMember} executer 
     * @param {GuildMember} member 
     * @returns {Array}
     */
    async memberActionRow(executer, member) {
        const blocked = await this.client.blocks.isBlocked(member);
        const muted = await this.client.mutes.isMuted(member);

        const topRow = this.actionRow()
            .addComponents(
                this.button()
                    .setCustomId(`show_card`)
                    .setLabel('Show Card')
                    .setStyle('SECONDARY'),
            );

        const midRow = this.actionRow()
            .addComponents(
                this.button()
                    .setCustomId(`show_warns`)
                    .setLabel('Show Warns')
                    .setStyle('PRIMARY'),
                this.button()
                    .setCustomId(`show_blocks`)
                    .setLabel('Show Blocks')
                    .setStyle('PRIMARY'),
                this.button()
                    .setCustomId(`show_mutes`)
                    .setLabel('Show Mutes')
                    .setStyle('PRIMARY'),
            );

        const bottomRow = this.actionRow()
            .addComponents(
                this.button()
                    .setCustomId(`warn_member`)
                    .setLabel('Warn Member')
                    .setStyle('DANGER'),
                this.button()
                    .setCustomId(blocked ? `unblock_member` : `block_member`)
                    .setLabel(blocked ? 'Unblock Member' : 'Block Member')
                    .setStyle(blocked ? 'SUCCESS' : 'DANGER'),
                this.button()
                    .setCustomId(muted ? `unmute_member` : `mute_member`)
                    .setLabel(muted ? 'Unmute Member' : 'Mute Member')
                    .setStyle(muted ? 'SUCCESS' : 'DANGER'),
            );

        return executer.permissions.has('VIEW_AUDIT_LOG') ? [topRow, midRow, bottomRow] : [topRow];
    }

    /**
     * 
     * @returns {MessageEmbed}
     */
    embed() {
        return new MessageEmbed()
            .setColor('PURPLE')
            .setTimestamp(new Date())
            .setFooter({ text: 'Owned by Stealth and Bunzi' });
    }

    /**
     * 
     * @param  {...any} args Arguments same as MessageAttachment from Discord.js module
     * @returns {MessageAttachment}
     */
    attachment(...args) {
        return new MessageAttachment(...args);
    }

    /**
     * 
     * @param {Array} arr 
     * @param {String} conj 
     * @returns {String}
     */
    list(arr, conj = 'and') {
        const len = arr.length;
        if (len == 0) return '';
        if (len == 1) return arr[0];
        return `${arr.slice(0, -1).join(', ')}${len > 1 ? `${len > 2 ? ',' : ''} ${conj} ` : ''}${arr.slice(-1)}`;
    }

    /**
     * 
     * @param {String} type 
     * @returns {String}
     */
    statusEmoji(type) {
        switch (type) {
            case 'dnd':
                return ':red_circle:';
            case 'idle':
                return ':yellow_circle:';
            case 'online':
                return ':green_circle:';
            default:
                return ':white_circle:';
        }
    }

    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {Map} contents 
     * @param {String} title
     * @param {Boolean} ephemeral
     * @param {Number} timeout
     */
    async pagination(interaction, contents, title, ephemeral = false, timeout = 60000) {
        let page = 0;

        const buttons = [
            this.button()
                .setCustomId('previous_page')
                .setLabel('⬅️')
                .setStyle('SECONDARY'),
            this.button()
                .setCustomId('next_page')
                .setLabel('➡️')
                .setStyle('SECONDARY')
        ];

        const row = this.actionRow().addComponents(buttons);

        const embeds = contents.map((content, index) => {
            const embed = this.embed()
                .setDescription(content)
                .setFooter({ text: `Page ${index + 1} of ${contents.length}` });
            if (title) embed.setTitle(title);

            return embed;
        });

        if (interaction.deferred === false) {
            await interaction.deferReply();
        }

        const currPage = await interaction.editReply({
            embeds: [embeds[page]],
            components: [row],
            fetchReply: true,
        });

        const filter = i =>
            i.customId === buttons[0].customId ||
            i.customId === buttons[1].customId;

        const collector = await currPage.createMessageComponentCollector({
            filter,
            time: timeout
        });

        collector.on('collect', async i => {
            switch (i.customId) {
                case buttons[0].customId:
                    page = page > 0 ? --page : embeds.length - 1;
                    break;
                case buttons[1].customId:
                    page = page + 1 < embeds.length ? ++page : 0;
                    break;
                default:
                    break;
            }

            await i.deferUpdate();
            await i.editReply({
                embeds: [embeds[page]],
                components: [row],
            });
            collector.resetTimer();
        })
            .on('end', (_, reason) => {
                if (reason !== 'messageDelete') {
                    const disabledRow = this.actionRow().addComponents(
                        buttons[0].setDisabled(true),
                        buttons[1].setDisabled(true)
                    );

                    currPage.edit({
                        embeds: [embeds[page]],
                        components: [disabledRow],
                    });
                }
            });

        return currPage;
    }
}