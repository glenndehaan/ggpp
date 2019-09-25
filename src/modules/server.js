/**
 * Import base packages
 */
const express = require('express');
const bodyParser = require('body-parser');
const { JsonDB } = require('node-json-db');
const { Config } = require('node-json-db/dist/lib/JsonDBConfig');

/**
 * Import own packages
 */
const log = require("./logger");

class server {
    /**
     * Constructor
     */
    constructor() {
        /**
         * Create globals
         */
        this.app = express();
        this.db = new JsonDB(new Config("catalog", true, false, '/'));

        /**
         * Check if we need to initialize the database
         */
        if(Object.keys(this.db.getData("/")).length === 0) {
            log.info("[DB] Initialized...".green);
            this.db.push("/projects", []);
            this.db.push("/patches", {});
        }
    }

    /**
     * Init the express app
     */
    init() {
        /**
         * Trust proxy
         */
        this.app.enable('trust proxy');

        /**
         * Configure app to use bodyParser()
         */
        this.app.use(bodyParser.urlencoded({extended: true}));
        this.app.use(bodyParser.json());

        /**
         * Request logger
         */
        this.app.use((req, res, next) => {
            log.debug(`[WEB][REQUEST](${req.method}): ${req.originalUrl}`.yellow);
            next();
        });

        /**
         * Configure routes
         */
        const projects = this.db.getData("/projects");
        for(let item = 0; item < projects.length; item++) {
            const project = projects[item];

            this.app.get(`/patch/${project}`, (req, res) => {
                res.json({
                    project,
                    patches: this.db.getData(`/patches/${project}`)
                });
            });
        }

        this.app.get('/', (req, res) => {
            const dbProjects = this.db.getData("/projects");
            const projects = [];

            for(let item = 0; item < dbProjects.length; item++) {
                projects.push({
                    project: dbProjects[item],
                    url: `${req.protocol}://${req.headers.host}/patch/${dbProjects[item]}`
                });
            }

            res.json(projects);
        });

        this.app.post('/add', (req, res) => {
            console.log('req.body', req.body);

            res.status(201).json({
                success: "OK"
            })
        });

        /**
         * Setup default 404 message
         */
        this.app.use((req, res) => {
            res.status(404).json({
                error: 'Not Found!'
            });
        });

        /**
         * Disable powered by header for security reasons
         */
        this.app.disable('x-powered-by');

        /**
         * Start listening on port
         */
        this.app.listen(5678, "0.0.0.0", () => {
            log.info(`[SERVER] Registry is running on: 0.0.0.0:5678`.cyan);
        });
    }
}

module.exports = new server();
