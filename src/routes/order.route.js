const express = require('express');

const { stripeCreateOrder } = require('../handlers/order.handler');

const router = new express.Router();

// stripe create order
// router.post('/create-order', stripeCreateOrder);

module.exports = router;