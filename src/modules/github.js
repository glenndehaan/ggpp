/**
 * Import vendor modules
 */
const fetch = require('node-fetch');

/**
 * Import own modules
 */
const log = require('./logger');

/**
 * Export all github functions
 */
module.exports = {
    /**
     * Checks for updates on GitHub
     */
    checkVersionUpdate: () => {
        return fetch('https://api.github.com/repos/glenndehaan/ggpp/releases/latest')
            .then((res) => {
                if (res.ok) {
                    return res;
                } else {
                    log.info(`[ERROR] Getting update information from GitHub!`.red);
                    throw Error('Getting update information from GitHub!');
                }
            })
            .then(res => res.json())
            .then((json) => {
                if(json.tag_name !== `v${global.version}`) {
                    log.info(`A new version of GGPP is available for download on GitHub: https://github.com/glenndehaan/ggpp/releases`.green);
                }
            })
            .catch(() => {});
    }
};
