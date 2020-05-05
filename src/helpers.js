module.exports = {
    createDir: (dir) => {
        const fs = require('fs');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
    },
    clearDir: (dir) => {
        const fs = require('fs');
        const path = require('path');

        if (fs.existsSync(dir)) {
            fs.readdir(dir, (err, files) => {
                if (err) throw err;
                for (const file of files) {
                    if (file !== ".terraform") {
                        fs.unlink(path.join(dir, file), err => {
                            if (err) throw err;
                        });
                    }
                }

            });
        }

    },
    writeFile: (file, content, cb) => {
        fs = require('fs');
        fs.writeFile(file, content, function (err) {
            if (err) cb(err, null);
            else cb(null, true);
        })
    },
    formatVariables: (variable, callback) => {
        const async = require('async');

        switch (typeof variable) {

            /*
            *
            * Objects can be key value, or array, in here we hanled both
            * 
            */
            case "object":

                //Arrays need to be formatted diffently than std objects
                if (Array.isArray(variable)) {
                    //Use map to recursively format nested variables
                    let res = async.map(variable, (item, cb) => {
                        const formatVariables = require('./helpers').formatVariables;
                        formatVariables(item, (res) => {
                            return cb(null, res);
                        });
                    }, (err, res) => { //Asyn completion callback.
                        callback(`[${res.join(",")}]`)
                    })
                    return true //terminate case now we've called back.
                }

                //Standard key value objects
                else {
                    var retArr = [];
                    async.forEachOf(variable, (value, key, cb) => {
                        const formatVariables = require('./helpers').formatVariables;
                        formatVariables(value, (res) => {
                            retArr.push(null, `${key} = ${res}`);
                            cb()
                        });
                    }, (err, res) => {
                        callback(`{\n${retArr.join("\n")}\n}`)
                    })
                    return true //terminate case now we've called back.
                }

            /*
            *
            * String just need to be returned with quotes.
            *
            */
            case "string":
                return callback(`\"${variable}\"`);

            /*
            *
            * Integers can stay as they are
            *
            */
            case "integer":
                return callback(variable);

            /*
            *
            * Bools can stay as they are
            *
            */
            case "boolean":
                return callback(variable);


            default:
                return callback(variable);
        }
    }
}