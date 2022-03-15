const Client = require('./Client');
const { DisTube } = require('distube');
const { SpotifyPlugin } = require('@distube/spotify');
const { YtDlpPlugin } = require('@distube/yt-dlp');
const { promisify } = require('util');
const { glob } = require('glob');
const PG = promisify(glob);
const Ascii = require('ascii-table');

module.exports = class Music extends DisTube {
    constructor(client) {
        super(client, {
            emitNewSongOnly: true,
            leaveOnFinish: false,
            emitAddSongWhenCreatingQueue: false,
            plugins: [new SpotifyPlugin(), new YtDlpPlugin()]
        });

        this.client = client;
        this.files = PG(`${process.cwd()}/events/music/*.js`);
    }

    async loadEvents() {
        const table = new Ascii('Music Events Loaded');
        const files = await this.files;

        files.forEach(async file => {
            const Event = require(file);
            if (typeof Event !== 'function') return table.addRow('❌ Event is not a class');
            const event = new Event(this.client);

            if (!event.name) {
                const l = file.split('/');
                table.addRow(`${event.name || 'Missing'}`, `❌ Event name is either invalid or missing: ${l[4] + `/` + l[5]}`);
                return;
            }

            if (event.once) {
                this.once(event.name, (...args) => event.run(...args));
            } else {
                this.on(event.name, (...args) => event.run(...args));
            }

            table.addRow(event.name, '✔ Loaded');
        });

        console.log(table.toString());
    }
}