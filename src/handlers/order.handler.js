const Order = require('../models/order.model');
const { findProductsByIdsArray, refactorCartItems, saveOrder } = require("../helpers/payhelper");
const { default: mongoose } = require('mongoose');
const { invoice } = require('./mails');
const { specialDateFormat } = require('../utils/date-format');
const { usdFormat } = require('../utils/currency-format');
const { isInt } = require('validator');

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
            const order = await saveOrder(
                billing, cartItems, Date.now(), null,
                subtotal, setting, total, 1, 'cod'
            );

            const formatedCarts = cartItems.map(p => ({
                name: p.name,
                price: usdFormat(p.price),
                color: p.color,
                qty: p.qty,
                totalprice: usdFormat(p.qty * p.price)
            }))

            invoice({
                Id: order.id,
                billing_details: JSON.parse(JSON.stringify(order.billdetails)),
                shipping_details: JSON.parse(JSON.stringify(order.shippdetails)) || JSON.parse(JSON.stringify(order.billdetails)),
                date: specialDateFormat(Date.now()),
                paymethod: order.paymethod,
                products: formatedCarts,
                order_details: {
                    subtotal: usdFormat(order.subtotal),
                    discount: order.discount && usdFormat(order.discount),
                    shipping: usdFormat(order.shipping),
                    tax: {
                        percent: setting.tax,
                        amount: usdFormat(order.tax)
                    },
                    total: usdFormat(order.totalAmount)
                }

            }, `${order.billdetails.fullname} <${order.billdetails.email}>, ${process.env.SITE_NAME} <${process.env.SITE_EMAIL}>`);

            res.status(200).json({ message: 'Order completed', orderId: order.id });
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
    },
    singleOrder: async (req, res, next) => {
        const { oId } = req.params;
        try {
            if (!oId || !mongoose.isValidObjectId(oId)) {
                return res.status(422).send({ error: 'Invalid Id' })
            }
            const order = await Order.findById(oId,
                'billdetails shippdetails productDetails subtotal discount shipping tax totalAmount status paymethod createdAt')
                .populate('productDetails.pId', 'name featured type');
            if (!order) {
                return res.status(404).send({ error: 'Order not found!' })
            }
            res.send({ order })

        } catch (e) {
            next(e)
        }
    },
    changeStatus: async (req, res, next) => {
        const { oId, status } = req.body;
        try {
            if (!oId || !mongoose.isValidObjectId(oId)) {
                return res.status(422).send({ error: 'Invalid Id' });
            }
            if (status < 1 || status > 4 || !Number.isInteger(parseInt(status))) {
                return res.status(422).send({ error: 'Invalid status' });
            }
            const order = await Order.findById(oId);
            if (order.status === status) {
                return res.status(400).send({ error: 'Order is in same state.' })
            }
            order.status = status;
            await order.save();
            res.send({ message: 'Order status changed.' });
        } catch (e) {
            next(e)
        }
    }
}