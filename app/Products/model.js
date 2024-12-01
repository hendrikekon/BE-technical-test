const mongoose = require('mongoose');
const {model, Schema} = mongoose;

const productSchema = new Schema({
    // pd_id:{
    //     type: Schema.Types.ObjectId,
    //     default: function(){
    //         return this._id;
    //     }
    // },
    pd_code:{
        type: String,
        required: [true, 'Product code is required'],
        unique: true,
        minlength: [3, 'Product code must be at least 3 characters long'],
        maxlength: [50, 'Product code cannot exceed 50 characters'],
        trim: true,
        default: function () {
            return this.pd_name
                .split(' ')
                .map(word => word[0].toUpperCase())
                .join('')
                + '-' + Date.now().toString().slice(-4);
        },
    },
    pd_ct_id:{
        type: Schema.Types.ObjectId,
        ref: 'Categories'
    },
    pd_name:{
        type: String,
        required: [true, 'Product name is required'],
        minlength: [3, 'Product name must be at least 3 characters long'],
        maxlength: [255, 'Product name cannot exceed 255 characters'],
    },
    pd_price:{
        type: Number,
        required: [true, 'Product price is required']
    },
    pd_created_at:{type: Date, default: Date.now},
    pd_updated_at:{type: Date, default: Date.now}
});

module.exports = model('Products', productSchema);