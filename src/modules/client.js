/**
 * Import vendor packages
 */
const fs = require('fs');
const ini = require('ini');
const fetch = require('node-fetch');
const Listr = require('listr');

/**
 * Import own packages
 */
const log = require("./logger");

class client {
    /**
     * Constructor
     */
    constructor() {
        if(!fs.existsSync(`${process.cwd()}/.ggpp`)) {
            log.info(`Error: Are you sure this project works with GGPP? Missing file: ${process.cwd()}/.ggpp`.red);
            process.exit(1);
        }

        this.config = ini.parse(fs.readFileSync(`${process.cwd()}/.ggpp`, 'utf-8'));

        if(this.config.version !== '1') {
            log.info(`Error: Incorrect config version. Current config version: ${this.config.version}`.red);
            process.exit(1);
        }
    }

    /**
     * Patches the current project
     */
    patch() {
        fetch(`${this.config.ggpp.registry}/patch/${this.config.ggpp.project}`)
            .then((res) => {
                if(res.ok) {
                    return res;
                } else {
                    log.info(`[ERROR] Getting patch information from registry (${this.config.ggpp.registry}/patch/${this.config.ggpp.project}). ${JSON.stringify(res)}`.red);
                    process.exit(1);
                }
            })
            .then(res => res.json())
            .then((json) => {
                log.info(`Found ${json.patches.length} patch(es) for project: ${this.config.ggpp.project}`.green);
                const taskList = [];

                for(let item = 0; item < json.patches.length; item++) {
                    taskList.push({
                        title: `Applying patch (${json.patches[item].id}): ${json.patches[item].description}`,
                        task: (ctx, task) => new Promise(resolve => {
                            if(item === 1) {
                                task.skip('Patch already applied!');
                                resolve();
                                return;
                            }

                            setTimeout(() => {
                                resolve('OK');
                            }, 2000);
                        })
                    })
                }

                const tasks = new Listr(taskList);
                tasks.run().catch(err => {
                    log.info(JSON.stringify(err).red);
                    process.exit(1);
                });
            });
    }

    /**
     * Creates a patch and uploads it to the registry
     *
     * @param description
     */
    create(description) {
        console.log('description', description);
        log.info('create!');
    }

    /**
     * Removes a patch from the registry
     *
     * @param id
     */
    remove(id) {
        console.log('id', id);
        log.info('remove!');
    }
}

module.exports = new client();
