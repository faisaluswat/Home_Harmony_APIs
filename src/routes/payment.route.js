const express = require('express');
const { createIntent, cancelIntent, successIntent } = require('../handlers/payment');

const router = new express.Router();

router.post('/create-payment', createIntent);
router.post('/cancel-payment', cancelIntent);
router.post('/place-order', successIntent);

module.exports = router