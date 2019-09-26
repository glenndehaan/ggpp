/**
 * Import vendor modules
 */
require('colors');
const program = require('commander');

/**
 * Import own modules
 */
const log = require('./modules/logger');
const github = require('./modules/github');

/**
 * Launches the app
 */
const run = async () => {
    /**
     * Setup globals
     */
    global.subcommand = false;

    /**
     * Output logo
     */
    log.info('_______  _______  _______  _______  ');
    log.info('|       ||       ||       ||       |');
    log.info('|    ___||    ___||    _  ||    _  |');
    log.info('|   | __ |   | __ |   |_| ||   |_| |');
    log.info('|   ||  ||   ||  ||    ___||    ___|');
    log.info('|   |_| ||   |_| ||   |    |   |    ');
    log.info('|_______||_______||___|    |___|    ');
    log.info('');

    /**
     * Output debug message
     */
    log.debug('Warning!!! | Application runs in debug mode! | Warning!!!');

    /**
     * Check for updates
     */
    await github.checkVersionUpdate();

    /**
     * Set globals
     */
    global.program = program;
    global.debug = program.debug;

    /**
     * Set program version
     */
    program.version('1.0.0');

    /**
     * Set program options
     */
    program
        .option('--registry <registry>', 'sets a temporary registry for the current command')
        .option('--project <project>', 'sets a temporary project for the current command')
        .option('-d, --debug', 'output debugging information');

    /**
     * Setup application commands
     */
    program
        .command('list')
        .description('list all available patches for the current project configuration')
        .action(() => {
            global.subcommand = true;
            require('./modules/client').list();
        });

    program
        .command('create <description>')
        .description('creates a new patch and uploads that to the repository')
        .action((source) => {
            global.subcommand = true;
            require('./modules/client').create(source);
        });

    program
        .command('delete <id>')
        .description('removes a patch from the repository')
        .action((source) => {
            global.subcommand = true;
            require('./modules/client').remove(source);
        });

    program
        .command('server')
        .description('starts the registry server')
        .action(() => {
            global.subcommand = true;
            require('./modules/server').init();
        });

    /**
     * Let commander handle process arguments
     */
    program.parse(process.argv);

    /**
     * Check if we want to run the server or client
     */
    if (!global.subcommand) {
        require('./modules/client').patch();
    }
};

/**
 * Run the app
 */
run();
