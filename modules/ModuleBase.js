const log4js = require("log4js");
const config = require('../config.json');

class ModuleBase{
    logger = {}; //logger object
    constructor(){
        log4js.configure(config.logger.options.log4js);
        this.logger = log4js.getLogger("app");
    }
}

module.exports = ModuleBase;