const program = require('commander');

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
 * Check if we want to run the server or client
 */
if(program.server) {
    console.log('Run server!');
} else {
    console.log('Run client!');
}
