const helpers = require('../helpers')
const { exec } = require("child_process");

module.exports = {
    preInitialise: (req, res) => {
        let userId = req.params.userId
        helpers.createDir(`${__dirname}/../../data/${userId}`)
        helpers.createDir(`${__dirname}/../../data/${userId}/terraform`)
        helpers.clearDir(`${__dirname}/../../data/${userId}/terraform`)
        res.sendStatus(200)
    },

    createProvisioners: (req, res) => {
        let { provisionerSettings } = req.body;
        let userId = req.params.userId
        let provisioner = `
    provider "aws" {
        access_key = "${provisionerSettings.accessKey}"
        secret_key = "${provisionerSettings.secretKey}"
        region     = "${provisionerSettings.region}"
    }
    `
        helpers.writeFile(`${__dirname}/../../data/${userId}/terraform/provisioner.tf`, provisioner, (err, data) => {
            if (data) {
                res.send(provisioner)
            }
            else {
                res.send(err)
            }
        });
    },

    createBackend: (req, res) => {
        let userId = req.params.userId
        const config = require('../../config')
        let backend = `
    terraform {
        backend "s3" {
            bucket     = "${config.terraformBackend.bucket}"
            key        = "state"
            region     = "${config.terraformBackend.region}"
            access_key = "${config.terraformBackend.accessKey}"
            secret_key = "${config.terraformBackend.secretKey}"
        }
    }
    `
        helpers.writeFile(`${__dirname}/../../data/${userId}/terraform/backend.tf`, backend, (err, data) => {
            if (data) {
                res.send(backend)
            }
            else {
                res.send(err)
            }
        });
    },

    createModule: (req, res) => {
        let userId = req.params.userId
        let { moduleSettings } = req.body;
        let { variables } = moduleSettings;
        const async = require('async')

        //Start module text
        let mod = `module \"${moduleSettings.name}\" { \n`;
        mod += `source = \"${moduleSettings.type}\" \n`;

        async.eachOf(variables, (value, key) => {
            helpers.formatVariables(value, (val) => {
                mod += `${key} = ${val} \n`
            });
        });

        //Close module file.
        mod += `}`;

        helpers.writeFile(`${__dirname}/../../data/${userId}/terraform/${moduleSettings.name}.tf`, mod, (err, data) => {
            if (data) {
                res.send(mod)
            }
            else {
                res.send(err)
            }
        });

    },

    init: (req, res) => {
        let userId = req.params.userId
        let dir = `${__dirname}/../../data/${userId}/terraform/`

        exec(`cd ${dir}; terraform init`, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
            res.sendStatus(200);
        });
    },

    plan: (req, res) => {
        let userId = req.params.userId
        let dir = `${__dirname}/../../data/${userId}/terraform/`

        exec(`cd ${dir}; terraform plan`, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                res.sendStatus(500)
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                res.sendStatus(501)
                return;
            }
            res.sendStatus(200);
        });
    }

}