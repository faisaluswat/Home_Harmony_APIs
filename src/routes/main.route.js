const express = require('express');
const { singleCat } = require('../handlers/cats.handlers');

const router = new express.Router();

// category
router.get('/cat/:cId', singleCat);

module.exports = router;