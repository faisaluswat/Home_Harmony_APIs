const express = require('express');

const { stripeCreateOrder, codOrder } = require('../handlers/order.handler');

const router = new express.Router();

// stripe create order
router.post('/create-order', codOrder);

module.exports = router;