const stripe = require('stripe')(process.env.STRIPE_SECRETE_KEY);

const Product = require('../models/product.model');
const Setting = require('../models/setting.model');

module.exports = {
    createIntent: async (req, res, next) => {
        const { cart, billing } = req.body;
        try {
            if (!cart || cart.length === 0) {
                return res.status(404).send({ error: 'Products not found' });
            }
            const prodIds = cart.map(p => p.pId);
            const products = await Product.find({
                _id: { $in: prodIds }
            });
            if (products.length === 0) {
                return res.status(404).send({ error: 'Products not found' });
            }
            const cartItems = cart.map(item => {
                const product = products.find(p => p._id.equals(item.pId));
                return { pId: product._id, color: item.color, qty: item.qty, price: product.sprice || product.rprice }
            });

            const setting = await Setting.findOne();

            const subtotal = cartItems.reduce((acc, cur) => acc + (cur.price * cur.qty), 0);
            const total = (subtotal - (subtotal * setting?.discount / 100)) + (subtotal * setting?.tax / 100) + setting?.shipping;

            if (!total) {
                return res.status(500).send({ error: 'Internal Server Error' });
            }

            const customer = await stripe.customers.create({
                name: billing.bname, email: billing.shipping
            })

            const paymentIntent = await stripe.paymentIntents.create({
                amount: total * 100,
                currency: 'USD',
                setup_future_usage: 'off_session',
                payment_method_types: ['card'],
                description: 'Order Purchase',
                statement_descriptor_suffix: 'Home Harmoney',
                customer: customer.id,
            })

            res.send({ client_secret: paymentIntent.client_secret, payId: paymentIntent.id })

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
                console.log(paymentIntent)
                // const order = await createOrder(paymentIntent);
                // res.status(200).json({ message: 'Order completed', order });
            } else {
                res.status(400).json({ error: 'Payment not successful' });
            }

        } catch (e) {
            next(e)
        }
    }
}