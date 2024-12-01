const path = require('path');
const Products = require('./model');
const Categories = require('../Categories/model');
const config = require('../config');

const store = async(req, res, next) => {
    try {
        let payload = req.body;


        if (payload.pd_ct_id) {
            const categories = await Categories.findOne({ ct_name: { $regex: payload.pd_ct_id, $options: 'i' } });
            if (categories) {
                payload.pd_ct_id = categories._id; // Assign the ObjectId from the found category
                console.log("Category found:", categories); // Log the category for verification
            } else {
                delete payload.pd_ct_id; // Remove the field if category not found
                console.log("Category not found:", payload.categories);
            }
        }


        const products = new Products(payload);
        await products.save();
        return res.status(200).json(products);
    } catch (error) {
        res.status(500).send(error);
        error(next)
    }
};
const show = async(req, res, next) => {
    try {
        let {skip = 0, limit = 10, q = '', categories = '',} = req.query;
        
        let criteria = {};

        if (q.length) {
            criteria = {
                pd_name: { $regex: q, $options: 'i' }
            }
        }

        if (categories && categories.length) {
            try {
              const categoriesResult = await Categories.findOne({ ct_name: { $regex: categories, $options: 'i' } });
              if (categoriesResult) {
                criteria = { ...criteria, pd_ct_id: categoriesResult._id };
              } else {
                return res.status(404).json({ error: 1, message: 'Category not found' });
              }
            } catch (error) {
              console.error('Error finding category:', error);
              return res.status(500).json({ error: 1, message: 'Internal server error' });
            }
        }

        const count = await Products.countDocuments(criteria)

        let products = await Products.find(criteria)
            .skip(parseInt(skip))
            .limit(parseInt(limit))
            .populate('pd_ct_id', 'ct_name')
            .select('-__v');;
            // .populate('categories');

        res.status(200).json({
            data:products,
            count
        });
    } catch (error) {
        res.status(500).send(error);
        error(next)
    }
};
const showById = async(req, res, next) => {
    const productId = req.params.id
    try {
        let products = await Products.findById(productId)
            .populate('pd_ct_id', 'ct_name');
        if (!products) {
            return res.status(404).json({ error: 1, message: 'Product not found' });
        }
        

        return res.status(200).json(products);
    } catch (error) {
        res.status(500).send(error);
        error(next)
    }
};
const update = async(req, res, next) => {
    try {
        const {id} = req.params;
        let updateData = req.body;
        
        if (updateData.pd_ct_id) {
            const categories = await Categories.findOne({ ct_name: { $regex: updateData.pd_ct_id, $options: 'i' } });
            if (categories) {
                updateData.pd_ct_id = categories._id;
            } else {
                delete updateData.pd_ct_id;
            }
        }

        let products = await Products.findByIdAndUpdate(id, updateData, {new: true});
        if (products){
            return res.status(200).json(products);
        }else{
            return res.status(404).json({error: 1, message: 'Product not found'});
        }
    } catch (error) {
        res.status(500).send(error);
        error(next)
    }
}
const destroy = async(req, res, next) => {
    try {
        const {id} = req.params;
        let products = await Products.findByIdAndDelete(id);
        if (products){
            return res.status(200).json({message: 'Product deleted successfully'});
        }else{
            return res.status(404).json({error: 1, message: 'Product not found'});
        }
    } catch (error) {
        res.status(500).send(error);
        error(next);
    }
};

module.exports = {
    store,
    show,
    showById,
    update,
    destroy,
};