const Cryptr = require('cryptr');
const Client = require('./Client');
const { SECRET } = process.env;

module.exports = class Cypher {
    /**
     * 
     * @param {Client} client 
     */
    constructor(client) {
        this.client = client;

        this.cryptr = new Cryptr(SECRET);
    }

    encrypt(str) {
        return this.cryptr.encrypt(str);
    }

    decrypt(str) {
        return this.cryptr.decrypt(str);
    }
}