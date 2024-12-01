const Orders = require('./model');
const Products = require('../Products/model');
const Users = require('../Users/model');

const store = async(req, res, next) => {
    try {
        const { or_pd_id, or_us_id, or_amount } = req.body;

        const product = await Products.findById(or_pd_id);
        const user = await Users.findById(or_us_id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const newOrder = new Orders({
            or_pd_id,
            or_us_id,
            or_amount,
        });

        await newOrder.save();

        return res.status(201).json({
            message: 'Order placed successfully',
            order: newOrder,
        });
    } catch (error) {
        res.status(404).send(error);
        error(next)
    }
};

const showById = async(req, res, next) => {
    try {
        const { id } = req.params;


        const order = await Orders.findById(id)
            .populate('or_pd_id', 'name price') 
            .populate('or_us_id', 'us_name us_email'); 

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        return res.status(200).json(order);
    } catch (error) {
        res.status(404).send(error);
        error(next)
    }
}

const index = async (req, res, next) => {
    try {
        let{skip = 0, limit=10} = req.query;
        
        const count = await Orders.find({ or_us_id: req.user._id }).countDocuments();

        const orders = await Orders.find({ or_us_id: req.user._id })
        .skip(parseInt(skip))
        .limit(parseInt(limit))
        .populate('or_pd_id', 'pd_name pd_price') 
        .populate('or_us_id', 'us_name us_email')
        .sort('-createdAt')
        return res.status(200).json({
            data: orders.map(order => order.toJSON({virtuals: true})),
            count
        });
    } catch (error) {

        next(error);
    }
};


const show = async(req, res, next) => {
    try {

        const order = await Orders.find()
            // .populate('or_pd_id', 'name price') 
            // .populate('or_us_id', 'us_name us_email'); 

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        return res.status(200).json(order);
    } catch (error) {
        res.status(404).send(error);
        error(next)
    }
}

const update = async(req, res, next) => {
    try {
        const { id } = req.params;
        const { or_amount } = req.body;

        const order = await Orders.findById(id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (or_amount) {
            order.or_amount = or_amount;
            order.or_updated_at = Date.now();
        }

        await order.save();

        return res.status(200).json({
            message: 'Order updated successfully',
            order,
        });
    } catch (error) {
        res.status(404).send(error);
        error(next)
    }
}

const destroy = async(req, res, next) => {
    try {
        const { id } = req.params;

        const order = await Orders.findById(id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Delete the order
        await Orders.findByIdAndDelete(id);

        return res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(404).send(error);
        error(next)
    }
}

module.exports = {
    store,
    showById,
    show,
    index,
    update,
    destroy,
}