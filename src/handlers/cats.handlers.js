const { default: mongoose } = require('mongoose');
const { validationResult } = require('express-validator');
const Cat = require('../models/cat.model');
const Product = require('../models/product.model');

module.exports = {
    addCat: async (req, res) => {
        const errs = validationResult(req);
        try {
            if (!errs.isEmpty()) {
                const errObj = {};
                errs.errors.forEach(e => {
                    errObj[e.path] = e.msg
                });
                return res.status(422).send({ validationErros: errObj });
            }
            await new Cat({
                name: req.body.name,
                desc: req.body.desc
            }).save()
            res.status(201).json({ message: 'Category Created' });
        } catch (e) {
            throw new Error(e);
        }
    },
    singleCat: async (req, res) => {
        const { cId } = req.params;
        try {
            if (!cId || !mongoose.isValidObjectId(cId)) {
                return res.status(422).send({ error: 'Invalid id to process' });
            }
            const cat = await Cat.findById(cId, 'name desc');
            if (!cat) return res.status(404).send({ error: 'Category not found.' });
            res.json({ cat });
        } catch (e) {
            throw new Error(e);
        }
    },
    updateCat: async (req, res) => {
        const errs = validationResult(req);
        const { cId } = req.params;
        try {
            if (!cId || !mongoose.isValidObjectId(cId)) {
                return res.status(422).send({ error: 'Invalid id to process' });
            }
            const isCat = await Cat.findById(cId);
            if (!isCat) return res.status(404).send({ error: 'Category not found.' });
            if (isCat.name === 'uncategorize') return res.status(400).send({ error: "Uncategorize category can't be updated." });

            if (!errs.isEmpty()) {
                const errObj = {};
                errs.errors.forEach(e => {
                    errObj[e.path] = e.msg
                });
                return res.status(422).send({ validationErros: errObj });
            }

            isCat.name = req.body.name;
            isCat.desc = req.body.desc;

            await isCat.save();
            res.json({ message: 'Category updated.' })

        } catch (e) {
            throw new Error(e);
        }
    },
    delCat: async (req, res) => {
        const { cId } = req.params;
        try {
            if (!cId || !mongoose.isValidObjectId(cId)) {
                return res.status(422).send(({ error: 'invlaid id to process' }));
            }
            const [isCat, uncategorize] = await Promise.all([
                Cat.findOneAndDelete({ _id: cId, name: { $ne: 'uncategorize' } }),
                Cat.findOne({ name: 'uncategorize' })
            ]);
            if (!isCat) {
                return res.status(404).send({ error: 'Category not found.' })
            }
            if (uncategorize) {
                Product.updateMany({ cat: isCat._id }, { $set: { cat: uncategorize.id } })
                    .catch(err => console.error("Error on set default category to products. " + err));
            }
            res.send({ message: 'Category deleted.' })
        } catch (e) {
            throw new Error(e)
        }
    },
    allCats: async (req, res) => {
        try {
            const cats = await Cat.aggregate([
                {
                    $lookup: {
                        from: 'products',
                        localField: '_id',
                        foreignField: 'cat',
                        as: 'products'
                    }
                },
                {
                    $project: {
                        name: 1,
                        productCount: { $size: '$products'}
                    }
                }
            ]).exec();
            res.send({ cats });
        } catch (e) {
            throw new Error(e)
        }
    }
}