const chalk = require('chalk');
class log {
    constructor() {

    };
    static log(out) {
        console.log(chalk.greenBright(out));
    };
    static warn(out) {
        console.warn(chalk.yellowBright(out));
    };
    static error(out) {
        console.error(chalk.redBright(out));
    }
    static dir(out) {
        console.dir(chalk.blueBright(out));
    }
}
module.exports = log;