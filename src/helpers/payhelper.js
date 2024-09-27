const Product = require('../models/product.model');
const Setting = require('../models/setting.model');
const Order = require("../models/order.model");

exports.findProductsByIdsArray = async (cart) => {
    const prodIds = cart.map(p => p.pId);
    const products = await Product.find({
        _id: { $in: prodIds }
    });
    return products
}

exports.refactorCartItems = async (cart, products) => {
    const cartItems = cart.map(item => {
        const product = products.find(p => p._id.equals(item.pId));
        return { pId: product._id, name: product.name, color: item.color, qty: item.qty, price: product.sprice || product.rprice }
    });

    const setting = await Setting.findOne();

    const subtotal = (cartItems.reduce((acc, cur) => acc + (cur.price * cur.qty), 0)).toFixed(2);
    const total = ((subtotal - (subtotal * setting?.discount / 100)) + (subtotal * setting?.tax / 100) + setting?.shipping).toFixed(2);

    return {
        cartItems, setting, subtotal, total
    }
}

exports.saveOrder = async (
    billing,
    cart,
    payId,
    customerId,
    subtotal,
    setting,
    total,
    status,
    paymethod,
) => {
    let shippingAdress = null;
    if (!billing.samebilling) {
        shippingAdress = {
            fullname: billing.sname,
            email: billing.semail,
            phone: billing.sphone,
            address: {
                street: billing.saddress,
                city: billing.scity,
                state: billing.sstate,
                country: billing.scountry,
                zipcode: billing.szip
            }
        }
    }

    const newOrder = {
        billdetails: {
            fullname: billing.bname,
            email: billing.bemail,
            phone: billing.bphone,
            address: {
                street: billing.baddress,
                city: billing.bcity,
                state: billing.bstate,
                country: billing.bcountry,
                zipcode: billing.bzip
            }
        },
        shippdetails: shippingAdress,
        productDetails: cart,
        payId: payId,
        customerId,
        subtotal,
        discount: setting.discount,
        shipping: setting.shipping,
        tax: ((subtotal * setting.tax) / 100).toFixed(),
        totalAmount: total,
        status,
        paymethod
    }

    const order = new Order(newOrder);
    await order.save();
    return order
}