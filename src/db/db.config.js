const mongoose = require('mongoose');

const uri = process.env.DB_URI || 'mongodb://127.0.0.1:27017/homeharmony';

mongoose.connect(uri).then(
    () => {
        console.info('connected.');
    },
    err => {
        console.error(err);
    }
)