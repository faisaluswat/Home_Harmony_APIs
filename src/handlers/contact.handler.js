const { message } = require("./mails");

module.exports = {
    sendMessage: async (req, res, next) => {
        try {
            const fields = req.body;
            const content = {
                text: () => {
                    let textContent = '';
                    for (let key in fields) {
                        if (key !== 'subject')
                            textContent += `${key}: ${fields[key]}\n`;
                    }
                    return textContent;
                },
                html: () => {
                    let htmlContent = '';
                    for (let key in fields) {
                        if (key !== 'subject')
                            htmlContent += `${key}: ${fields[key]}<br>`;
                    }
                    return htmlContent;
                }
            };
            const error = await message(content, fields.subject);
            if (error) {
                return res.status(400).send({ error })
            }
            res.send({ message: 'Your message was recieved.' })
        } catch (e) {
            next(e)
        }
    }
}