const { message } = require("./mails");
const Book = require('../models/book.model');

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
    },
    booking: async (req, res, next) => {
        try {
            const {
                name, phone, street, city, zip, mark,
                rooms, roomwidth, roomlength,
                kitchens, kitchenwidth, kitchenlength,
                otherroom, otherwidth, otherlength,
                living, livingwidth, livinglength
            } = req.body;

            const booking = new Book({
                fullname: name,
                phone,
                aptDetails: {
                    address: {
                        street,
                        city,
                        zip,
                        landmark: mark
                    },
                    bedrooms: {
                        count: rooms,
                        w: rooms == 0 ? 0 : roomwidth,
                        l: rooms == 0 ? 0 : roomlength
                    },
                    kitchens: {
                        count: kitchens,
                        w: kitchens == 0 ? 0 : kitchenwidth,
                        l: kitchens == 0 ? 0 : kitchenlength
                    },
                    otherroom: {
                        count: otherroom,
                        w: otherroom == 0 ? 0 : otherwidth,
                        l: otherroom == 0 ? 0 : otherlength
                    },
                    livingroom: {
                        exist: living,
                        w: living == 0 ? 0 : livingwidth,
                        l: living == 0 ? 0 : livinglength
                    }
                }
            })
            await booking.save();
            res.status(201).send({ message: 'Recieved' })
        } catch (e) {
            next(e)
        }
    }
}