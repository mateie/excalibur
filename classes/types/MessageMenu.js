const Menu = require("./Menu");

module.exports = class MessageMenu extends Menu {
    constructor(client, data) {
        super(client, data)

        this.data.setType(3);
    }
}