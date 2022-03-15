const Event = require(`../../../classes/types/Event`);

module.exports = class Error extends Event {
    constructor(client) {
        super(client);
        this.name = 'error';
    }

    async run(error) {
        console.error(err);
    }
}