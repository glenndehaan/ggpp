/**
 * Import vendor packages
 */
const fs = require('fs');
const ini = require('ini');
const readlineSync = require('readline-sync');
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
        if (!fs.existsSync(`${process.cwd()}/.ggpp`)) {
            log.info(`Error: Are you sure this project works with GGPP? Missing file: ${process.cwd()}/.ggpp`.red);
            process.exit(1);
        }

        this.config = ini.parse(fs.readFileSync(`${process.cwd()}/.ggpp`, 'utf-8'));
        this.git = require('simple-git')(process.cwd());

        if (this.config.version !== '1') {
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
                if (res.ok) {
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

                for (let item = 0; item < json.patches.length; item++) {
                    taskList.push({
                        title: `Applying patch (${json.patches[item].id}): ${json.patches[item].description}`,
                        task: (ctx, task) => new Promise((resolve, reject) => {
                            if (item > 1) {
                                task.skip('Patch already applied!');
                                resolve();
                                return;
                            }

                            fs.writeFileSync(`${process.cwd()}/temp.patch`, json.patches[item].patch);

                            this.git.raw([
                                'apply',
                                `${process.cwd()}/temp.patch`
                            ], (err, result) => {
                                console.log('err', err);
                                console.log('result', result);
                            });

                            // setTimeout(() => {
                            //     resolve('OK');
                            // }, 2000);
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
        this.git.diffSummary((err, result) => {
            if(err) {
                log.info(err.red);
                process.exit(1);
                return;
            }

            log.info(`Warning! The patch will include the following files:`.yellow);
            for (let item = 0; item < result.files.length; item++) {
                const file = result.files[item];
                log.info(`${file.file}`.green);
            }
            log.info('');

            let userWantsToContinue = readlineSync.question('Are you sure you want to include all files above in the patch (y/n): ');
            while (userWantsToContinue !== "y" && userWantsToContinue !== "n") {
                userWantsToContinue = readlineSync.question('Are you sure you want to include all files above in the patch (y/n): ');
            }

            if(userWantsToContinue === "n") {
                process.exit(0);
                return;
            }

            this.git.diff((err, result) => {
                if(err) {
                    log.info(err.red);
                    process.exit(1);
                    return;
                }

                fetch(`${this.config.ggpp.registry}/add`, {
                    method: 'POST',
                    body: JSON.stringify({project: this.config.ggpp.project, description, patch: result}),
                    headers: {'Content-Type': 'application/json'}
                })
                    .then((res) => {
                        if (res.ok) {
                            return res;
                        } else {
                            log.info(`[ERROR] Uploading patch to registry (${this.config.ggpp.registry}/add). ${JSON.stringify(res)}`.red);
                            process.exit(1);
                        }
                    })
                    .then((res) => res.json())
                    .then((json) => {
                        log.info(`Patch ${json.id} created!!`.green);
                    });
            });
        });
    }

    /**
     * Removes a patch from the registry
     *
     * @param id
     */
    remove(id) {
        fetch(`${this.config.ggpp.registry}/remove`, {
            method: 'POST',
            body: JSON.stringify({project: this.config.ggpp.project, id}),
            headers: {'Content-Type': 'application/json'}
        })
            .then((res) => {
                if (res.ok) {
                    return res;
                } else {
                    log.info(`[ERROR] Removing patch from registry (${this.config.ggpp.registry}/remove) are you sure this patch exists in project ${this.config.ggpp.project}?. ${JSON.stringify(res)}`.red);
                    process.exit(1);
                }
            })
            .then(() => {
                log.info(`Patch ${id} removed!!`.green);
            });
    }
}

module.exports = new client();
