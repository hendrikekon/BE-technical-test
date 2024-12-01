const mongoose = require('mongoose');
const {model, Schema} = mongoose;
const bcrypt = require("bcrypt");

const usersSchema =  new Schema({
    // us_id:{
    //     type: Schema.Types.ObjectId,
    //     default: function(){
    //         return this._id;
    //     }
    // },
    us_name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255,
    },
    us_password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 255,
    },
    us_email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
    },
    us_phone_number: {type: String, },
    us_address: {type: String, },
    token: [String],
    us_created_at: {type: Date, default: Date.now},
    us_updated_at: {type: Date, default: Date.now},
});

// Validasi Email
usersSchema.path('us_email').validate(function(value) {
    const EMAIL_RE = /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/gm;
    return EMAIL_RE.test(value);
}, attr => `${attr.value} harus merupakan email yang valid!`);

//cek Email sudah terdaftar atau belum
usersSchema.path('us_email').validate(async function(value) {
    try{
        const count = await this.model('Users').countDocuments({us_email: value})
        return !count;
    }catch(err){
        throw err;
    }
}, attr => `${attr.value} Sudah terdaftar`)

//hash Password
const HASH_ROUND = 10;
usersSchema.pre('save', function(next) {
    console.log('Hashing password:', this.us_password);
    this.us_password = bcrypt.hashSync(this.us_password, HASH_ROUND);
    console.log('Hashing password:', this.us_password);
    next();
});

module.exports = model('Users', usersSchema);