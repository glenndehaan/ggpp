module.exports = {
    /**
     * Logs a message to the console
     *
     * @param message
     */
    info: (message) => {
        console.log(message);
    },

    /**
     * Logs a message to the console of we run in debug mode
     *
     * @param message
     */
    debug: (message) => {
        if (global.debug) {
            console.log(message.yellow);
        }
    }
};
