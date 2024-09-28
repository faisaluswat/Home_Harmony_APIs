const stripe = require('stripe')(process.env.STRIPE_SECRETE_KEY);

const { findProductsByIdsArray, refactorCartItems, saveOrder } = require('../helpers/payhelper');
const { usdFormat } = require('../utils/currency-format');
const { specialDateFormat } = require('../utils/date-format');
const { invoice } = require('./mails');
module.exports = {
    createIntent: async (req, res, next) => {
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
            req.session.orderData = { billing, cartItems, setting, subtotal, total };
            const customer = await stripe.customers.create({
                name: billing.bname, email: billing.bemail
            })

            const paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(total * 100),
                currency: 'USD',
                setup_future_usage: 'off_session',
                payment_method_types: ['card'],
                description: 'Order Purchase',
                statement_descriptor_suffix: process.env.SITE_NAME || 'Home Harmoney',
                customer: customer.id,
            })

            res.send({ client_secret: paymentIntent.client_secret, payId: paymentIntent.id });

        } catch (e) {
            next(e);
        }
    },
    cancelIntent: async (req, res, next) => {
        try {
            let { payId } = req.body;
            if (!payId) {
                return res.status(400).send({ error: 'Invalid Id' });
            }
            const paymentIntent = await stripe.paymentIntents.cancel(payId);
            res.send({ status: paymentIntent.status });
        } catch (e) {
            next(e)
        }
    },
    successIntent: async (req, res, next) => {
        const { payId } = req.body;
        try {
            const paymentIntent = await stripe.paymentIntents.retrieve(payId);
            if (paymentIntent.status === 'succeeded') {
                const { orderData } = req.session;
                if (!orderData) {
                    return res.status(400).send({ error: 'Something wrong with data.' })
                }
                const order = await saveOrder(
                    orderData.billing, orderData.cartItems, paymentIntent.id, null,
                    orderData.subtotal, orderData.setting, orderData.total, 1, 'stripe'
                );
                delete req.session.orderData;

                const formatedCarts = orderData.cartItems.map(p => ({
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
                            percent: orderData.setting.tax,
                            amount: usdFormat(order.tax)
                        },
                        total: usdFormat(order.totalAmount)
                    }

                }, `${order.billdetails.fullname} <${order.billdetails.email}>, ${process.env.SITE_NAME} <${process.env.SITE_EMAIL}>`);

                res.status(200).json({ message: 'Order completed', orderId: order.id });
            } else {
                res.status(400).json({ error: 'Payment not successful' });
            }

        } catch (e) {
            next(e)
        }
    }
}