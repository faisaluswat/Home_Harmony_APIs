const { default: mongoose } = require('mongoose');
const prodErrors = require('../utils/prodsError')
const Cat = require('../models/cat.model');
const Product = require('../models/product.model');
const getFullYear = require('../utils/get-full-year');


module.exports = {
    addProd: async (req, res) => {
        try {
            const validationErrors = await prodErrors(req)
            if (validationErrors) {
                return res.status(422).send(validationErrors)
            }
            const { name, desc, colors, sku, cat, rprice, sprice, type } = req.body;
            const uncat = await Cat.findOne({ name: 'uncategorize' });
            const newProd = { name, desc, rprice, colors, sku, sprice, type };

            if (cat && mongoose.isValidObjectId(cat)) {
                const cat = await Cat.findById(cat);
                if (cat) newProd.cat = cat._id;
                else newProd.cat = uncat?._id
            } else newProd.cat = uncat?._id;

            if (req.files) {
                // Check for featured file
                if (req.files.featured && req.files.featured[0]) {
                    newProd.featured = `/media/${getFullYear()}/${req.files.featured[0].filename}`;
                }

                // Check for gallery files
                if (req.files.gallery && req.files.gallery.length > 0) {
                    newProd.gallery = req.files.gallery.map(file => `/media/${getFullYear()}/${file.filename}`);
                }
            }

            await new Product(newProd).save();
            res.status(201).send({ message: "Product created." })

        } catch (e) {
            throw new Error(e);
        }
    }
}