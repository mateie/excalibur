const Client = require('../Client');

module.exports = class Event {
    /**
     * 
     * @param {Client} client 
     */
    constructor(client) {
        this.client = client;
    }
}