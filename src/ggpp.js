/**
 * Import vendor modules
 */
require('colors');
const program = require('commander');

/**
 * Import own modules
 */
const packageJson = require('../package.json');
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
     * Set globals
     */
    global.version = packageJson.version;
    global.program = program;
    global.debug = program.debug;

    /**
     * Set program version
     */
    program.version(packageJson.version);

    /**
     * Check for updates
     */
    await github.checkVersionUpdate();

    /**
     * Set program options
     */
    program
        .option('--registry <registry>', 'sets a temporary registry for the current command')
        .option('--project <project>', 'sets a temporary project for the current command')
        .option('--auth <code>', 'sets the authentication code for the server/sets the authentication code for uploading/deleting patches to the server')
        .option('-d, --debug', 'output debugging information');

    /**
     * Setup application commands
     */
    program
        .command('init')
        .description('initializes a project configuration within the current directory')
        .action(() => {
            global.subcommand = true;
            require('./modules/config').init();
        });

    program
        .command('list')
        .description('list all available patches for the current project configuration')
        .action(() => {
            global.subcommand = true;
            require('./modules/client').list();
        });

    program
        .command('download [id]')
        .description('downloads one or all patches for the current project')
        .action((source) => {
            global.subcommand = true;
            require('./modules/client').download(source);
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
