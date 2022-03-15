const Event = require(`../../../classes/types/Event`);

module.exports = class Warn extends Event {
    constructor(client) {
        super(client);
        this.name = 'warn';
    }

    async run(info) {
        console.info(info);
    }
}