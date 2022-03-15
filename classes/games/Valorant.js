const { RiotApiClient, Region } = require('@survfate/valorant.js');
const { CommandInteraction, ButtonInteraction } = require('discord.js');
const valorantAssets = require('valorant-api-js');
const Client = require('../Client');

module.exports = class Valorant {
    /**
     * 
     * @param {Client} client
     */
    constructor(client) {
        this.client = client;
        this.assets = new valorantAssets();
    }

    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {Array} items 
     * @param {Number} timeout 
     */
    async skinsEmbed(interaction, items, timeout = 12000) {
        let page = 0;

        const buttons = [
            this.client.util.button()
                .setCustomId('store_prev_item')
                .setLabel('⬅️')
                .setStyle('SECONDARY'),
            this.client.util.button()
                .setCustomId('store_next_item')
                .setLabel('➡️')
                .setStyle('SECONDARY'),
        ];

        const row = this.client.util.actionRow().addComponents(buttons);

        const promises = items.map(async item => {
            const { data: { displayIcon: image } } = await this.client.valorant.assets.getSkinLevels(item.id);
            const embed = this.client.util.embed()
                .setTitle('Your Valorant Store')
                .setDescription(`Item: ${item.name}\nCost: ${item.cost.amount} VP`)
                .setImage(image);

            return embed;
        });

        const embeds = await Promise.all(promises);

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
            time: timeout,
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
        }).on('end', (_, reason) => {
            if (reason !== 'messageDelete') {
                const disabledRow = this.client.util.actionRow().addComponents(
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

    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {Array} items 
     * @param {Number} currPage 
     */
    async inventoryEmbed(interaction, items, timeout = 12000) {
        let page = 0;

        const topButtons = [
            this.client.util.button()
                .setCustomId('inventory_prev_item')
                .setLabel('⬅️')
                .setStyle('SECONDARY'),
            this.client.util.button()
                .setCustomId('inventory_next_item')
                .setLabel('➡️')
                .setStyle('SECONDARY'),
        ];

        const bottomButtons = [
            this.client.util.button()
                .setCustomId('inventory_identity')
                .setLabel('Identity')
                .setStyle('PRIMARY'),
            this.client.util.button()
                .setCustomId('inventory_gun_skins')
                .setLabel('Gun Skins')
                .setStyle('DANGER'),
            this.client.util.button()
                .setCustomId('inventory_sprays')
                .setLabel('Sprays')
                .setStyle('SUCCESS'),
            this.client.util.button()
                .setCustomId('inventory_cancel_embed')
                .setLabel('⛔')
                .setStyle('SECONDARY')
        ];

        const topRow = this.client.util.actionRow().addComponents(topButtons);
        const bottomRow = this.client.util.actionRow().addComponents(bottomButtons);

        const { Identity, GunSkins, Sprays } = items;

        const pageFilters = i =>
            i.customId === topButtons[0].customId ||
            i.customId === topButtons[1].customId;

        const menuFilters = i =>
            i.customId === bottomButtons[0].customId ||
            i.customId === bottomButtons[1].customId ||
            i.customId === bottomButtons[2].customId ||
            i.customId === bottomButtons[3].customId;


        if (interaction.deferred === false) {
            await interaction.deferReply();
        }

        const currPage = await interaction.editReply({
            components: [bottomRow],
            fetchReply: true
        });

        const pageCollector = currPage.createMessageComponentCollector({
            pageFilters,
            time: timeout
        });

        const menuCollector = currPage.createMessageComponentCollector({
            menuFilters,
            time: timeout
        });

        let embeds;

        pageCollector
            .on('collect', async i => {
                switch (i.customId) {
                    case topButtons[0].customId:
                        page = page > 0 ? --page : embeds.length - 1;
                        await i.deferUpdate();
                        await i.editReply({
                            embeds: [embeds[page]],
                            components: [topRow, bottomRow]
                        });
                        break;
                    case topButtons[1].customId:
                        page = page + 1 < embeds.length ? ++page : 0;
                        await i.deferUpdate();
                        await i.editReply({
                            embeds: [embeds[page]],
                            components: [topRow, bottomRow]
                        });
                        break;
                }
            });

        menuCollector
            .on('collect', async i => {
                switch (i.customId) {
                    case bottomButtons[0].customId:
                        const { data: { largeArt: playerCard } } = await this.client.valorant.assets.getPlayerCards(Identity.PlayerCardID).catch(console.error);
                        const { data: { titleText: playerTitle } } = await this.client.valorant.assets.getPlayerTitles(Identity.PlayerTitleID).catch(console.error);
                        const accountLevel = Identity.HideAccountLevel ? 'Hidden' : Identity.AccountLevel;
                        const embed =
                            this.client.util.embed()
                                .setTitle(playerTitle)
                                .setImage(playerCard)
                                .setDescription(`Account Level: ${accountLevel}`);

                        await i.deferUpdate();
                        await i.editReply({
                            embeds: [embed],
                            components: [bottomRow]
                        });

                        break;
                    case bottomButtons[1].customId:
                        const promisesSkins = Object.values(GunSkins).map(async id => {
                            const { data: skin } = await this.client.valorant.assets.getSkins(id);
                            const embed = this.client.util.embed()
                                .setTitle(skin.displayName)
                                .setImage(skin.chromas[0].fullRender);

                            return embed;
                        });

                        embeds = await Promise.all(promisesSkins);

                        page = 0;

                        await i.deferUpdate();
                        await i.editReply({
                            embeds: [embeds[page]],
                            components: [topRow, bottomRow]
                        });

                        break;
                    case bottomButtons[2].customId:
                        const promisesSprays = Object.values(Sprays).map(async id => {
                            const { data: spray } = await this.assets.getSprays(id);
                            const embed = this.client.util.embed()
                                .setTitle(spray.displayName)
                                .setImage(spray.fullTransparentIcon);

                            return embed;
                        });

                        embeds = await Promise.all(promisesSprays);

                        page = 0;

                        await i.deferUpdate();
                        await i.editReply({
                            embeds: [embeds[page]],
                            components: [topRow, bottomRow]
                        });

                        break;
                    case bottomButtons[3].customId:
                        interaction.deleteReply();
                        pageCollector.stop();
                        return menuCollector.stop();
                }

                menuCollector.resetTimer();
            });
    }

    async isAuthenticated(member) {
        const db = await this.client.database.getMember(member);
        if (!member.valorant && !db.valorant.authenticated) return false;
        return true;
    }

    async login(member) {
        const db = await this.client.database.getMember(member);
        if (!db) return;
        if (!db.valorant) return;
        if (!db.valorant.authenticated) return member.valorant = null;
        member.valorant = await new RiotApiClient({
            username: db.valorant.username,
            password: this.client.cypher.decrypt(db.valorant.password),
            region: Region[db.valorant.region]
        }).login();
    }
}