const express = require('express');
const { getPublicKey } = require('../handlers/payment');

const router = new express.Router();

router.get('/public-key', getPublicKey);

module.exports = router