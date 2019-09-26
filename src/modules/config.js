/**
 * Import vendor packages
 */
const fs = require('fs');
const readlineSync = require('readline-sync');

/**
 * Import own packages
 */
const log = require("./logger");

class config {
    /**
     * Initializes a project configuration
     */
    init() {
        const registryUrl = readlineSync.question('Enter the registry URL (http://example.com): ');
        const projectName = readlineSync.question('Enter the project name (example_project_2019): ');

        const iniTemplate = `; Define GGPP Standard\nversion = 1\n\n[ggpp]\nregistry = ${registryUrl}\nproject = ${projectName}\n`;

        log.info(`The following changes will be written to the config file: (${process.cwd()}/.ggpp)`.green);
        log.info(iniTemplate);
        log.info('');

        let userWantsToContinue = readlineSync.question('All information correct? (y/n): ');
        while (userWantsToContinue !== "y" && userWantsToContinue !== "n") {
            userWantsToContinue = readlineSync.question('All information correct? (y/n): ');
        }

        if (userWantsToContinue === "n") {
            process.exit(0);
            return;
        }

        fs.writeFileSync(`${process.cwd()}/.ggpp`, iniTemplate);
        log.info(`Config created!`.green);
    }
}

module.exports = new config();
