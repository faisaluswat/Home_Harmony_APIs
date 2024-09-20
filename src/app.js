const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const passport = require('passport');
const session = require("express-session");
const MongoStore = require('connect-mongo');

// initialize express
const app = new express();

// env configuration
require('dotenv').config();

// db config
require('./db/db.config')


// imports
const authRouter = require('./routes/auth.route');
const dashRouter = require('./routes/dash.route');
const mainRouter = require('./routes/main.route');
const paymentRouter = require('./routes/payment.route');
const orderRouter = require('./routes/order.route');

const errorHandler = require('./middlewares/errorhandler');
const { isAdmin } = require('./middlewares/authorize');
const { tokenAuth } = require('./middlewares/passport');

// public path
const publicPath = path.join(__dirname, '../public');

// config public path
app.use(express.static(publicPath));


// whiteListed setup
const whitelist = process.env.WHITELIST ? process.env.WHITELIST.split(',') : ['*'];
const corsOptions = {
    origin: function (origin, cb) {
        if (whitelist.includes('*') || whitelist.indexOf(origin) !== -1 || !origin) {
            cb(null, true)
        } else {
            cb(new Error(origin + ', Not allowed by CORS'));
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    preflightContinue: false,
    credentials: true
}

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    maxAge: 60 * 60 * 24,
    store: MongoStore.create({
        mongoUrl: process.env.DB_URI,
        touchAfter: 60 * 60 * 24,
        ttl: 60 * 60 * 24,
        autoRemove: 'native',
        crypto: {
            secret: process.env.CRYPTO_SECRET
        }
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        // sameSite: false
    },
}))
app.use(passport.initialize());
app.use(cors(corsOptions))
app.use(helmet.hsts({
    maxAge: 31536000,  // 1 year in seconds
    includeSubDomains: true
}));
app.disable('x-powered-by');


app.use('/api/auth', authRouter);
app.use('/api/dash', tokenAuth, isAdmin, dashRouter);
app.use('/api/main', mainRouter);
app.use('/api/pay', paymentRouter);
app.use('/api/order', orderRouter);


app.use(errorHandler);


module.exports = app;