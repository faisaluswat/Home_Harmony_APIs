const express = require('express');
const { singleCat, allCats } = require('../handlers/cats.handlers');
const { singleProd, paginateProds, paginateProdsByCat } = require('../handlers/prods.handler');
const { settingsInfo } = require('../handlers/setting');
const { sendMessage } = require('../handlers/contact.handler');

const router = new express.Router();

// category
router.get('/cat/:cId', singleCat);
router.get('/cats', allCats)

// products
router.get('/product/:pId', singleProd);
router.get("/products", paginateProds);
router.get("/products/:cat", paginateProdsByCat);

// setting
router.get('/settings', settingsInfo);

// send Message
router.post('/send-message', sendMessage)

module.exports = router;