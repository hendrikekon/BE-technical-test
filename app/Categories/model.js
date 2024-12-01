const mongoose = require('mongoose');
const {model, Schema} = mongoose;

const categoriesSchema = new Schema({
    // ct_id:{
    //     type: Schema.Types.ObjectId,
    //     default: function(){
    //         return this._id;
    //     }
    // },
    ct_code:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        default: function () {
            return this.ct_name
                .split(' ')
                .map(word => word[0].toUpperCase())
                .join('')
                + '-' + Date.now().toString().slice(-4);
        },
    },
    ct_name:{
        type: String,
        required: true,
        trim: true,
    },
    ct_created_at:{type: Date, default: Date.now},
    ct_updated_at:{type: Date, default: Date.now},
});


module.exports = model('Categories', categoriesSchema);