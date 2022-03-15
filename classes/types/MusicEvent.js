const Client = require('../Client');

module.exports = class Event {
    /**
     * 
     * @param {Client} client 
     */
    constructor(client) {
        this.client = client;
        this.status = queue => `Volume: \`${queue.volume}%\` | Filter: \`${queue.filters.join(', ') || 'Off'}\` | Loop: \`${queue.repeatMode ? (queue.repeatMode === 2 ? 'All Queue' : 'This Song') : 'Off'
            }\` | Autoplay: \`${queue.autoplay ? 'On' : 'Off'}\``;
    }
}