const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');

const transporter = nodemailer.createTransport({
    service: process.env.MAIL_SERVICE,
    host: process.env.MIAL_HOST,
    port: process.env.MAIL_PORT,
    secure: process.env.MAIL_PORT === 465,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
})

transporter.use('compile', hbs({
    viewEngine: {
        extname: '.hbs',
        layoutsDir: __dirname + '/templates/mail',
        defaultLayout: false
    },
    extName: '.hbs',
    viewPath: 'templates/mail'
}))

module.exports = transporter;