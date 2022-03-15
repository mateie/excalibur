const { CLIENT_ID: clientId, GUILD_ID: guildId } = process.env;
const Client = require('../Client');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const { promisify } = require('util');
const { glob } = require('glob');
const PG = promisify(glob);
const Ascii = require('ascii-table');
const perms = require('../../validation/permissions');

module.exports = class CommandHandler {
    /**
     * 
     * @param {Client} client 
     */
    constructor(client) {
        this.client = client;

        this.files = PG(`${process.cwd()}/menus/**/*.js`);
    }

    async load() {
        const table = new Ascii('Menus Loaded');
        const files = await this.files;

        files.forEach(async file => {
            const Menu = require(file);
            if (typeof Menu !== 'function') return table.addRow('❌ Menu is not a class');
            const menu = new Menu(this.client);

            if (!menu.data) return table.addRow(file.split('/')[7], '❌ Failed', 'Missing data');
            if (!menu.data.name) return table.addRow(file.split('/')[7], '❌ Failed', 'Missing name');
            if (menu.permission) {
                if (perms.includes(menu.permission)) menu.data.defaultPermission = false;
                else return table.addRow(menu.data.name, '❌ Failed', 'Permission is invalid');
            }
            if (!menu.run) return table.addRow(menu.data.name, '❌ Failed', 'Missing `run` function')
            if (typeof menu.run !== 'function') return table.addRow(menu.data.name, '❌ Failed', '`run` should be a function');

            this.client.menus.set(menu.data.name, menu);

            await table.addRow(menu.data.name, '✔ Loaded');
        });

        console.log(table.toString());
    }
}