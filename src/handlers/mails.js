const transporter = require("../services/mail-service");

module.exports = {
    invoice: async (info, email) => {
        try {
            const send = await transporter.sendMail({
                from: process.env.MAIL_EMAIL,
                to: email,
                subject: process.env.SITE_NAME + ' Order',
                text: 'Your order is placed.',
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
    }
}