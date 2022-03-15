const Menu = require("./Menu");

module.exports = class MemberMenu extends Menu {
    constructor(client, data) {
        super(client, data);

        this.data.setType(2);
    }
}