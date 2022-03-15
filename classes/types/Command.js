const Client = require('../Client');
const { SlashCommandBuilder, roleMention } = require('@discordjs/builders');
const { CommandInteraction } = require('discord.js');

module.exports = class Command {
    /**
     * 
     * @param {Client} client 
     */
    constructor(client) {
        this.client = client;
        this.data = new SlashCommandBuilder();
    }

    /**
     * 
     * @param {String} roleId Role ID to mention
     */
    mentionRole(roleId) {
        return roleMention(roleId);
    }

    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    run(interaction) { }
}