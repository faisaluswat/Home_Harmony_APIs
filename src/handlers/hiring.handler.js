const { default: mongoose } = require('mongoose');
const Book = require('../models/book.model');

module.exports = {
    bookings: async (req, res, next) => {
        try {
            const hirings = await Book.find({}, 'fullname phone bookingInfo.bookingDate bookingInfo.completionDate bookingInfo.status').sort({ createdAt: -1 });
            res.send({ hirings })
        } catch (e) {
            next(e)
        }
    },
    singleBook: async (req, res, next) => {
        const { hId } = req.params;
        try {
            if (!hId || !mongoose.isValidObjectId(hId)) {
                return res.status(422).send({ error: 'Invalid Id' });
            }
            const singleHire = await Book.findById(hId);
            if (!singleHire) {
                return res.status(404).send({ error: 'Not found' });
            }
            res.send({ hired: singleHire });

        } catch (e) {
            next(e)
        }
    }
}