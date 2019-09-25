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
 * Check if we want to run the server or client
 */
if(program.server) {
    require('./modules/server').init();
} else {
    log.info('Run client!');
}
