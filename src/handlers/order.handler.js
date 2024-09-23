const Order = require('../models/order.model');
const { findProductsByIdsArray, refactorCartItems, saveOrder } = require("../helpers/payhelper");

module.exports = {
    codOrder: async (req, res, next) => {
        const { cart, billing } = req.body;
        try {
            if (!cart || cart.length === 0) {
                return res.status(404).send({ error: 'Products not found' });
            }

            const products = await findProductsByIdsArray(cart);
            if (products.length === 0) {
                return res.status(404).send({ error: 'Products not found' });
            }

            const { cartItems, setting, subtotal, total } = await refactorCartItems(cart, products);

            if (!total) {
                return res.status(500).send({ error: 'Internal Server Error' });
            }
            const { orderId } = await saveOrder(
                billing, cartItems, Date.now(), null,
                subtotal, setting, total, 1, 'cod'
            );
            res.status(200).json({ message: 'Order completed', orderId });
        } catch (e) {
            next(e)
        }
    },
    paginateOrders: async (req, res, next) => {
        const { skip, limit } = req.query;
        try {
            const orders = await Order.find({}, 'billdetails totalAmount status createdAt paymethod')
                .sort({ createdAt: -1 }).skip(skip).limit(limit);

            const totalOrders = await Order.countDocuments();
            res.send({ orders, totalOrders })

        } catch (e) {
            next(e)
        }
    }
}