const transporter = require("../services/mail-service");

module.exports = {
    invoice: async (info, email) => {
        try {
            const send = await transporter.sendMail({
                from: process.env.MAIL_EMAIL,
                to: email,
                subject: process.env.SITE_NAME + ' Order',
                text: 'Your order is recieved.',
                template: 'invoice',
                context: {
                    info,
                    site_name: process.env.SITE_NAME,
                    site_url: process.env.CLIENT_URL
                }
            })

            if (send) {
                console.info('Invoice Mail Sent. ' + send.messageId);
            }
        } catch (e) {
            console.error('Invoice Mail sending failed. ' + e);
        }
    },
    message: async (fields, subject) => {
        try {
            const send = await transporter.sendMail({
                from: process.env.MAIL_EMAIL,
                to: process.env.SITE_EMAIL,
                subject: subject,
                text: fields.text(),
                html: fields.html()
            })

            if (send) {
                console.info('Invoice Mail Sent. ' + send.messageId);
            }
        } catch (e) {
            console.error('Message Mail sending failed. ' + e);
            return 'Message sending failed.'
        }
    }
}