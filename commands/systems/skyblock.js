const Command = require('../../classes/types/Command');
const { CommandInteraction } = require('discord.js');

module.exports = class SkyblockCommand extends Command {
    constructor(client, data) {
        super(client, data);

        this.data
            .setName('skyblock')
            .setDescription('Hypixel Skyblock Command')
            .addSubcommand(subcommand =>
                subcommand
                    .setName('getflips')
                    .setDescription('Get prices between these two')
                    .addStringOption(option =>
                        option
                            .setName('item')
                            .setDescription('Item to check flips for')
                            .setRequired(true)
                    )
            );
    }

    /**
    *
    * @param {CommandInteraction} interaction
    */
    async run(interaction) {
        const { options } = interaction;
        const subcommand = options.getSubcommand();
        switch (subcommand) {
            case 'getflips': {
                await interaction.deferReply();
                const item = options.getString('item');
                const fetchAuctions = await this.client.hypixel.getSkyblockAuctions();
                const auctions = [];
                fetchAuctions.auctions.filter(auction => auction.bin && !auction.claimed && auction.item === item).sort(async (prev, next) => {
                    if (prev.auctioneerUuid === next.auctioneerUuid) {
                        const exists = auctions.find(auc => auc.id === prev.auctioneerUuid && auc.id === next.auctioneerUuid);
                        if (!exists) {
                            auctions.push({
                                id: next.auctioneerUuid,
                                auctions: [prev, next]
                            });
                        } else {
                            exists.auctions.push(next);
                        }
                    }
                });

                const promises = auctions.map(async auction => {
                    const player = await this.client.hypixel.getPlayer(auction.id);
                    return `
                        ${player.nickname} is selling ${auction.auctions.length} \`${item}\`
                    `;
                });

                Promise.all(promises).then(contents => this.client.util.pagination(interaction, contents));
                break;
            }
        }
    }
}