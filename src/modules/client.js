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

        if (global.program.registry) {
            this.config.ggpp.registry = global.program.registry;
        }

        if (global.program.project) {
            this.config.ggpp.project = global.program.project;
        }

        if (this.config.version !== '1') {
            log.info(`Error: Incorrect config version. Current config version: ${this.config.version}`.red);
            process.exit(1);
        }
    }

    /**
     * Initializes a project configuration
     */
    init() {
        const registryUrl = readlineSync.question('Enter the registry URL (http://example.com): ');
        const projectName = readlineSync.question('Enter the project name (example_project_2019): ');

        const iniTemplate = `; Define GGPP Standard\nversion = 1\n\n[ggpp]\nregistry = ${registryUrl}\nproject = ${projectName}\n`;

        log.info(`The following changes will be written to the config file: (${process.cwd()}/.ggpp)`.green);
        log.info(iniTemplate);
        log.info('');

        let userWantsToContinue = readlineSync.question('All information correct? (y/n): ');
        while (userWantsToContinue !== "y" && userWantsToContinue !== "n") {
            userWantsToContinue = readlineSync.question('All information correct? (y/n): ');
        }

        if (userWantsToContinue === "n") {
            process.exit(0);
            return;
        }

        fs.writeFileSync(`${process.cwd()}/.ggpp`, iniTemplate);
        log.info(`Config created!`.green);
    }

    /**
     * List all available patches
     */
    list() {
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
                log.info(`${json.patches.length} patch(es) are available for project: ${this.config.ggpp.project}`.green);

                for (let item = 0; item < json.patches.length; item++) {
                    const patch = json.patches[item];
                    log.info(`(${patch.id})(${patch.username}): ${patch.description}`);
                }
            })
            .catch((e) => {
                log.info(`[ERROR] Getting patch information from registry (${this.config.ggpp.registry}/patch/${this.config.ggpp.project}). ${JSON.stringify(e)}`.red);
            });
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
                        title: `Applying patch (${json.patches[item].id})(${json.patches[item].username}): ${json.patches[item].description}`,
                        task: (ctx, task) => new Promise((resolve, reject) => {
                            fs.writeFileSync(`${process.cwd()}/temp.patch`, json.patches[item].patch);

                            this.git.raw([
                                'apply',
                                `${process.cwd()}/temp.patch`
                            ], (err) => {
                                fs.unlinkSync(`${process.cwd()}/temp.patch`);
                                if (err) {
                                    if (!err.includes('patch does not apply')) {
                                        reject(new Error(err));
                                        return;
                                    } else {
                                        task.skip('Patch already applied!');
                                        resolve();
                                        return;
                                    }
                                }

                                resolve();
                            });
                        })
                    })
                }

                const tasks = new Listr(taskList, {
                    exitOnError: false
                });
                tasks.run().catch(() => {
                    process.exit(1);
                });
            })
            .catch((e) => {
                log.info(`[ERROR] Getting patch information from registry (${this.config.ggpp.registry}/patch/${this.config.ggpp.project}). ${JSON.stringify(e)}`.red);
            });
    }

    /**
     * Stores the patches locally
     *
     * @param id
     */
    download(id) {
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
                log.info(`Storing patches to: ${process.cwd()}/.patches`.green);

                if (!fs.existsSync(`${process.cwd()}/.patches`)) {
                    fs.mkdirSync(`${process.cwd()}/.patches`);
                }

                for (let item = 0; item < json.patches.length; item++) {
                    const patch = json.patches[item];

                    if (id) {
                        if (id === patch.id) {
                            log.info(`Saving patch (${patch.id}): ${patch.description}`);
                            fs.writeFileSync(`${process.cwd()}/.patches/${patch.description}.patch`, patch.patch);
                        }
                    } else {
                        log.info(`Saving patch (${patch.id}): ${patch.description}`);
                        fs.writeFileSync(`${process.cwd()}/.patches/${patch.description}.patch`, patch.patch);
                    }
                }
            })
            .catch((e) => {
                log.info(`[ERROR] Getting patch information from registry (${this.config.ggpp.registry}/patch/${this.config.ggpp.project}). ${JSON.stringify(e)}`.red);
            });
    }

    /**
     * Creates a patch and uploads it to the registry
     *
     * @param description
     */
    create(description) {
        const headers = {
            'Content-Type': 'application/json'
        };

        if (global.program.auth) {
            headers.auth = global.program.auth;
        }

        this.git.diffSummary((err, result) => {
            if (err) {
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

            if (userWantsToContinue === "n") {
                process.exit(0);
                return;
            }

            this.git.diff((err, result) => {
                if (err) {
                    log.info(err.red);
                    process.exit(1);
                    return;
                }

                this.git.raw([
                    'config',
                    'user.name'
                ], (err, username) => {
                    fetch(`${this.config.ggpp.registry}/add`, {
                        method: 'POST',
                        body: JSON.stringify({
                            project: this.config.ggpp.project,
                            description,
                            username: username.replace(/(\r\n|\n|\r)/gm, ""),
                            patch: result
                        }),
                        headers
                    })
                        .then((res) => {
                            if (res.ok) {
                                return res;
                            } else if (res.status === 401) {
                                log.info(`[ERROR] This registry requires authorization! Use the --auth parameter to provide your code`.red);
                                process.exit(1);
                            } else if (res.status === 403) {
                                log.info(`[ERROR] Authorization code incorrect!`.red);
                                process.exit(1);
                            } else {
                                log.info(`[ERROR] Uploading patch to registry (${this.config.ggpp.registry}/add). ${JSON.stringify(res)}`.red);
                                process.exit(1);
                            }
                        })
                        .then((res) => res.json())
                        .then((json) => {
                            log.info(`Patch ${json.id} created!!`.green);
                        })
                        .catch((e) => {
                            log.info(`[ERROR] Uploading patch to registry (${this.config.ggpp.registry}/add). ${JSON.stringify(e)}`.red);
                        });
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
        const headers = {
            'Content-Type': 'application/json'
        };

        if (global.program.auth) {
            headers.auth = global.program.auth;
        }

        fetch(`${this.config.ggpp.registry}/remove`, {
            method: 'POST',
            body: JSON.stringify({project: this.config.ggpp.project, id}),
            headers
        })
            .then((res) => {
                if (res.ok) {
                    return res;
                } else if (res.status === 401) {
                    log.info(`[ERROR] This registry requires authorization! Use the --auth parameter to provide your code`.red);
                    process.exit(1);
                } else if (res.status === 403) {
                    log.info(`[ERROR] Authorization code incorrect!`.red);
                    process.exit(1);
                } else {
                    log.info(`[ERROR] Removing patch from registry (${this.config.ggpp.registry}/remove) are you sure this patch exists in project ${this.config.ggpp.project}?. ${JSON.stringify(res)}`.red);
                    process.exit(1);
                }
            })
            .then(() => {
                log.info(`Patch ${id} removed!!`.green);
            })
            .catch((e) => {
                log.info(`[ERROR] Removing patch from registry (${this.config.ggpp.registry}/remove) are you sure this patch exists in project ${this.config.ggpp.project}?. ${JSON.stringify(e)}`.red);
            });
    }
}

module.exports = new client();
