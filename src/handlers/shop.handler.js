const Order = require('../models/order.model');
const Product = require('../models/product.model');
const User = require('../models/user.model');

module.exports = {
    overview: async (req, res, next) => {
        try {
            const orders = await Order.find({}, 'billdetails totalAmount status createdAt paymethod').sort({ createdAt: -1 });
            const totalProducts = await Product.countDocuments({ status: true })
            const exceptCanceledOrders = orders.filter(o => o.status !== 4);

            const date = new Date();
            const month = date.getMonth();
            const year = date.getFullYear();

            const currentMonthOrders = exceptCanceledOrders.filter(o => {
                const odate = new Date(o.createdAt);
                return odate.getMonth() === month && odate.getFullYear() === year;
            })

            const monthlySale = currentMonthOrders.reduce((acc, cur) => acc + cur.totalAmount, 0);
            const deliveredOrders = orders.filter(o => o.status === 3).length;
            const recentOrders = orders.slice(0, 7);
            res.send({ totalProducts, monthlySale, deliveredOrders, recentOrders })
        } catch (e) {
            next(e)
        }
    },
    profile: async (req, res, next) => {
        try {
            const user = await User.findById(req.user.uId, "name avatar")
            if (!user) {
                return res.status(404).send({ error: 'User not found' });
            }
            res.send({ profile: user })
        } catch (e) {
            next(e)
        }
    }
}