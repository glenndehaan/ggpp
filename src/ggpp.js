/**
 * Import vendor modules
 */
require('colors');
const program = require('commander');

/**
 * Import own modules
 */
const log = require('./modules/logger');

/**
 * Set program version
 */
program.version('0.0.1');

/**
 * Set program options
 */
program
    .option('-s, --server', 'starts the registry server')
    .option('-d, --debug', 'output debugging information');

/**
 * Let commander handle process arguments
 */
program.parse(process.argv);

/**
 * Set globals
 */
global.program = program;
global.debug = program.debug;

/**
 * Output debug message
 */
log.debug('Warning!!! | Application runs in debug mode! | Warning!!!'.yellow);

/**
 * Check if we want to run the server or client
 */
if(program.server) {
    require('./modules/server').init();
} else {
    log.info('Run client!');
}
