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
 * Setup globals
 */
global.subcommand = false;

/**
 * Output logo
 */
log.info('GGGGGGGGGGGGG        GGGGGGGGGGGGGPPPPPPPPPPPPPPPPP   PPPPPPPPPPPPPPPPP           ');
log.info('GGG::::::::::::G     GGG::::::::::::GP::::::::::::::::P  P::::::::::::::::P       ');
log.info('GG:::::::::::::::G   GG:::::::::::::::GP::::::PPPPPP:::::P P::::::PPPPPP:::::P    ');
log.info('G:::::GGGGGGGG::::G  G:::::GGGGGGGG::::GPP:::::P     P:::::PPP:::::P     P:::::P  ');
log.info('G:::::G       GGGGGG G:::::G       GGGGGG  P::::P     P:::::P  P::::P     P:::::P ');
log.info('G:::::G              G:::::G                P::::P     P:::::P  P::::P     P:::::P');
log.info('G:::::G              G:::::G                P::::PPPPPP:::::P   P::::PPPPPP:::::P ');
log.info('G:::::G    GGGGGGGGGGG:::::G    GGGGGGGGGG  P:::::::::::::PP    P:::::::::::::PP  ');
log.info('G:::::G    G::::::::GG:::::G    G::::::::G  P::::PPPPPPPPP      P::::PPPPPPPPP    ');
log.info('G:::::G    GGGGG::::GG:::::G    GGGGG::::G  P::::P              P::::P            ');
log.info('G:::::G        G::::GG:::::G        G::::G  P::::P              P::::P            ');
log.info('G:::::G       G::::G G:::::G       G::::G  P::::P              P::::P             ');
log.info('G:::::GGGGGGGG::::G  G:::::GGGGGGGG::::GPP::::::PP          PP::::::PP            ');
log.info('GG:::::::::::::::G   GG:::::::::::::::GP::::::::P          P::::::::P             ');
log.info('GGG::::::GGG:::G     GGG::::::GGG:::GP::::::::P          P::::::::P               ');
log.info('GGGGGG   GGGG        GGGGGG   GGGGPPPPPPPPPP          PPPPPPPPPP                  ');
log.info('');

/**
 * Output debug message
 */
log.debug('Warning!!! | Application runs in debug mode! | Warning!!!');

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
 * Setup application commands
 */
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
 * Check if we want to run the server or client
 */
if (!global.subcommand) {
    if (program.server) {
        require('./modules/server').init();
    } else {
        require('./modules/client').patch();
    }
}
