const express = require('express');

const { addProd, updateProd, delProd } = require('../handlers/prods.handler');
const handleMulterError = require('../middlewares/upload');
const prodValid = require('../middlewares/validation/product');
const { addCat, updateCat, delCat } = require('../handlers/cats.handlers');
const catValidate = require('../middlewares/validation/cat');
const updateCatValidate = require('../middlewares/validation/updateCat');
const updateProdValid = require('../middlewares/validation/updateprod');
const { settings } = require('../handlers/setting');
const settingValid = require('../middlewares/validation/setting');
const { overview, profile } = require('../handlers/shop.handler');
const { paginateOrders, singleOrder, changeStatus } = require('../handlers/order.handler');

const router = new express.Router();

// categories
router.post('/add-cat', catValidate, addCat);
router.patch('/update-cat/:cId', updateCatValidate, updateCat);
router.delete('/del-cat/:cId', delCat)

// Products
router.post('/add-product', handleMulterError, prodValid, addProd);
router.patch('/update-product/:pId', handleMulterError, updateProdValid, updateProd)
router.delete('/del-product/:pId', delProd);

// setting
router.post('/settings', settingValid, settings);

// shop
router.get('/overview', overview);

// profile
router.get('/profile', profile);

// Orders
router.get('/orders/:oId', singleOrder)
router.get('/orders', paginateOrders)
router.patch('/change-status', changeStatus)

module.exports = router;