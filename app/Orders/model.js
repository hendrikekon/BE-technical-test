const mongoose = require('mongoose');
const {model, Schema} = mongoose;

const orderSchema = new Schema({
    // or_id:{
    //     type: Schema.Types.ObjectId,
    //     default: function (){
    //         return this._id;
    //     }
    // },
    or_pd_id:{
        type: Schema.Types.ObjectId,
        ref: 'Products'
    },
    or_us_id:{
        type: Schema.Types.ObjectId,
        ref: 'Users'
    },
    or_amount:{type: Number, required: true},
    or_created_at:{type: Date, default: Date.now},
    or_updated_at:{type: Date, default: Date.now}
});

module.exports = model('Orders', orderSchema);