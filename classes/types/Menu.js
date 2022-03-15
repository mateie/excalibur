const Client = require('../Client');
const { ContextMenuCommandBuilder, roleMention } = require('@discordjs/builders');

module.exports = class Menu {
    /**
     * 
     * @param {Client} client 
     */
    constructor(client) {
        this.client = client;

        this.data = new ContextMenuCommandBuilder();
    }

    /**
    * 
    * @param {String} roleId Role ID to mention
    */
    mentionRole(roleId) {
        return roleMention(roleId);
    }
}