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

        this.files = PG(`${process.cwd()}/commands/**/*.js`);
    }

    async load() {
        const table = new Ascii('Commands Loaded');
        const files = await this.files;

        files.forEach(async file => {
            const Command = require(file);
            if (typeof Command !== 'function') return table.addRow('❌ Command is not a class');
            const command = new Command(this.client);

            if (!command.data) return table.addRow(file.split('/')[7], '❌ Failed', 'Missing data');
            if (!command.data.name) return table.addRow(file.split('/')[7], '❌ Failed', 'Missing name');
            if (!command.data.description) return table.addRow(command.data.name, '❌ Failed', 'Missing description');
            if (command.permission) {
                if (perms.includes(command.permission)) command.data.defaultPermission = false;
                else return table.addRow(command.data.name, '❌ Failed', 'Permission is invalid');
            }
            if (!command.run) return table.addRow(command.data.name, '❌ Failed', 'Missing `run` function')
            if (typeof command.run !== 'function') return table.addRow(command.data.name, '❌ Failed', '`run` should be a function');

            this.client.commands.set(command.data.name, command);

            await table.addRow(command.data.name, '✔ Loaded');
        });

        console.log(table.toString());
    }

    async deploy() {
        const guild = this.client.guilds.cache.get(guildId);
        const clientCommands = this.client.commands;
        const clientMenus = this.client.menus;
        const token = this.client.token;

        const body = [];

        clientCommands.forEach(command => {
            body.push(command.data.toJSON());
        });

        clientMenus.forEach(menu => {
            body.push(menu.data.toJSON());
        })

        const rest = new REST({ version: '10' }).setToken(token);

        try {
            console.info('Pushing Application Commands to REST');

            await rest.put(
                Routes.applicationGuildCommands(clientId, guildId),
                { body }
            )
                .then(async commands => {
                    commands = commands.filter(c => c.type == 1);
                    const Roles = commandName => {
                        const cmdPerms = this.client.commands.find(c => c.data.name === commandName).permission;
                        if (!cmdPerms) return null;

                        return guild.roles.cache.filter(r => r.permissions.has(cmdPerms));
                    }

                    const fullPermissions = commands.reduce((accum, r) => {
                        const roles = Roles(r.name);
                        if (!roles) return accum;

                        const permissions = roles.reduce((a, r) => {
                            return [...a, { id: r.id, type: 'ROLE', permission: true }];
                        }, []);

                        return [...accum, { id: r.id, permissions }];
                    }, []);

                    await guild.commands.permissions.set({ fullPermissions });
                }).catch(console.error);

            console.log('Pushed Application Commands to REST');
        } catch (err) {
            console.error(err);
        }
    }
}