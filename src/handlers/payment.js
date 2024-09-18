const stripe = require('stripe')(process.env.STRIPE_SECRETE_KEY);

const { findProductsByIdsArray, refactorCartItems, saveOrder } = require('../helpers/payment');
const Product = require('../models/product.model');
const Setting = require('../models/setting.model');

module.exports = {
    createIntent: async (req, res, next) => {
        const { cart, name, email } = req.body;
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

            // const { orderId } = await saveOrder(billing, cartItems, null, null,
            //     subtotal, setting, total, 1, 'stripe');

            const customer = await stripe.customers.create({
                name, email
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

                // const order = await createOrder(paymentIntent);
                const products = await findProductsByIdsArray(cart);
                const { cartItems, setting, subtotal, total } = await refactorCartItems(cart, products);
                const { orderId } = await saveOrder(
                    billing, cartItems, paymentIntent.id, null,
                    subtotal, setting, total, 1, 'stripe'
                );
                res.status(200).json({ message: 'Order completed', orderId });
            } else {
                res.status(400).json({ error: 'Payment not successful' });
            }

        } catch (e) {
            next(e)
        }
    }
}