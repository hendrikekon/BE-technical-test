const path = require('path');
const Categories = require('./model');

const store = async(req, res, next) => {
    try {
        let payload = req.body;
        const categories = new Categories(payload);
        await categories.save();
        return res.status(200).json(categories);
    } catch (error) {
        res.status(500).send(error);
        error(next)
    }
};
const show = async(req, res, next) => {
    try {
        let {skip = 0, limit = 10, } = req.query;
        let categories = await Categories.find()
            .skip(parseInt(skip))
            .limit(parseInt(limit));
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).send(error);
        error(next)
    }
};

const update = async(req, res, next) => {
    try {
        const {id} = req.params;
        let updateData = req.body;
        let categories = await Categories.findByIdAndUpdate(id, updateData, {new: true});
        if (categories){
            return res.status(200).json(categories);
        }else{
            return res.status(404).json({error: 1, message: 'Categories not found'});
        }
    } catch (error) {
        res.status(500).send(error);
        error(next)
    }
}
const destroy = async(req, res, next) => {
    try {
        const {id} = req.params;
        let categories = await Categories.findByIdAndDelete(id);
        if (categories){
            return res.status(200).json({message: 'categories deleted successfully'});
        }else{
            return res.status(404).json({error: 1, message: 'categories not found'});
        }
    } catch (error) {
        res.status(500).send(error);
        error(next);
    }
};

module.exports = {
    store,
    show,
    update,
    destroy,
};