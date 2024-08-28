const { default: mongoose } = require('mongoose');
const { prodErrors, removeProdsFiles, removeOldFiles, removeProdOldFiles } = require('../utils/prodsError')
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
                const isCat = await Cat.findById(cat);
                if (isCat) newProd.cat = isCat._id;
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
    },
    updateProd: async (req, res) => {
        const { pId } = req.params;
        try {
            if (!pId || !mongoose.isValidObjectId(pId)) {
                removeProdsFiles(req);
                return res.status(422).send({ error: 'Invalid product id to process.' })
            }

            const validationErrors = await prodErrors(req);
            if (validationErrors) {
                return res.status(422).send(validationErrors)
            }

            const product = await Product.findById(pId);
            if (!product) {
                removeProdsFiles(req);
                return res.status(404).send({ error: 'Product not found.' })
            }

            removeOldFiles(req, product);

            const cat = req.body?.cat;
            if (!cat) delete req.body.cat;
            Object.assign(product, req.body);
            if (cat && mongoose.isValidObjectId(cat) && await Cat.exists({ _id: cat })) {
                product.cat = cat;
            };
            if (req.files?.featured) {
                product.featured = `/media/${getFullYear()}/${req.files?.featured[0].filename}`;
            }
            if (req.files?.gallery) {
                product.gallery = req.files?.gallery.map(img => `/media/${getFullYear()}/${img.filename}`);
            }
            await product.save();
            res.send({ message: 'Product updated.' });
        } catch (e) {
            throw new Error(e)
        }
    },
    delProd: async (req, res) => {
        const { pId } = req.params;
        try {
            if (!pId || !mongoose.isValidObjectId(pId)) {
                return res.status(422).send({ error: 'Invalid Id to process' });
            }
            const product = await Product.findOneAndDelete({ _id: pId });
            if (!product) {
                return res.status(404).send({ error: 'Product not found.' });
            }
            removeProdOldFiles(product);
            res.send({ message: 'Product deleted.' });
        } catch (e) {
            throw new Error(e)
        }
    },
    singleProd: async (req, res) => {
        const { pId } = req.params;
        try {
            if (!pId || !mongoose.isValidObjectId(pId)) {
                return res.status(422).send({ error: 'Invalid Id to process' });
            }
            const product = await Product.findById(pId, 'name desc featured colors cat rprice sprice type').populate('cat', 'name');
            if (!product) return res.status(404).send({ error: 'Product not found.' });
            res.json({ product });
        } catch (e) {
            throw new Error(e);
        }
    },
    paginateProds: async (req, res) => {
        const { skip, limit } = req.query;
        try {
            let products = [];
            const totalProds = await Product.countDocuments();
            if (!skip && limit) {
                products = await Product.find({}, 'name desc featured colors cat rprice sprice type').populate('cat', 'name').sort({ createdAt: -1 }).limit(limit);
            } else if (skip && limit) {
                products = await Product.find({}, 'name desc featured colors cat rprice sprice type').populate('cat', 'name').sort({ createdAt: -1 }).skip(skip).limit(limit);
            } else {
                products = await Product.find({}, 'name desc featured colors cat rprice sprice type').populate('cat', 'name').sort({ createdAt: -1 });
            }

            res.send({ totalProds, products })
        } catch (e) {
            throw new Error(e)
        }
    },
    paginateProdsByCat: async (req, res) => {
        const { skip, limit } = req.query;
        const catName = req.params.cat;
        try {
            if (!catName) {
                return res.status(422).send({ error: 'Invalid category.' });
            }
            const cat = await Cat.findOne({ name: catName.toLowerCase() });
            if (!cat) {
                return res.status(404).send({ error: 'Category not found' });
            }
            let products = [];
            const totalProds = await Product.countDocuments({ cat: cat.id });
            if (!skip && limit) {
                products = await Product.find({ cat: cat.id }, 'name desc featured colors cat rprice sprice type').populate('cat', 'name').sort({ createdAt: -1 }).limit(limit);
            } else if (skip && limit) {
                products = await Product.find({ cat: cat.id }, 'name desc featured colors cat rprice sprice type').populate('cat', 'name').sort({ createdAt: -1 }).skip(skip).limit(limit);
            } else {
                products = await Product.find({ cat: cat.id }, 'name desc featured colors cat rprice sprice type').populate('cat', 'name').sort({ createdAt: -1 });
            }

            res.send({ totalProds, products })
        } catch (e) {
            throw new Error(e)
        }
    }
}