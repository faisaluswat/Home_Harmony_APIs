const mongoose = require('mongoose');

const uri = process.env.DB_URI;

mongoose.connect(uri).then(
    () => {
        console.info('connected.');
    },
    err => {
        console.error(err);
    }
)