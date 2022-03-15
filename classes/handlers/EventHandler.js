const Client = require('../Client');
const { promisify } = require('util');
const { glob } = require('glob');
const PG = promisify(glob);
const Ascii = require('ascii-table');
const events = require('../../validation/eventNames');

module.exports = class EventHandler {
    /**
     * 
     * @param {Client} client 
     */
    constructor(client) {
        this.client = client;

        this.files = PG(`${process.cwd()}/events/discord/**/*.js`);
    }

    async load() {
        const table = new Ascii('Events Loaded');
        const files = await this.files;

        files.forEach(async file => {
            const Event = require(file);
            if (typeof Event !== 'function') return table.addRow('❌ Event is not a class');
            const event = new Event(this.client);

            if (!events.includes(event.name) || !event.name) {
                const l = file.split('/');
                table.addRow(`${event.name || 'Missing'}`, `❌ Event name is either invalid or missing: ${l[4] + `/` + l[5]}`);
                return;
            }

            if (event.once) {
                this.client.once(event.name, (...args) => event.run(...args));
            } else {
                this.client.on(event.name, (...args) => event.run(...args));
            }

            table.addRow(event.name, '✔ Loaded');
        });

        console.log(table.toString());
    }
}