const express = require('express');

const { addProd } = require('../handlers/prods.handler');
const handleMulterError = require('../middlewares/upload');
const prodValid = require('../middlewares/validation/product');

const router = new express.Router();

router.post('/add-product', handleMulterError, prodValid, addProd)

module.exports = router;