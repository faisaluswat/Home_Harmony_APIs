const mongoose = require('mongoose');

const catSeed = require('./cat');
const adminSeed = require('./admin');
require('dotenv').config()
require('../db/db.config');

const args = process.argv.slice(2);

(async () => {
    try {
        const promises = [];

        if (args.includes('admin')) {
            promises.push(adminSeed());
        }

        if (args.includes('cat')) {
            promises.push(catSeed());
        }

        if (promises.length === 0) {
            promises.push(adminSeed(), catSeed());
        }

        await Promise.all(promises);
    } catch (err) {
        console.error("Error in seedings:", err);
        // process.exit(1);
    } finally {
        mongoose.disconnect();
        console.log('disconnected.')
        process.exit(0);
    };
})()