const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const validator = require('validator');

module.exports = mongoose.model('User', new Schema({ 
    name: {type: String, trim: true, unique: true, required: true}, 
    mail: {type: String,
           trim: true,
           unique: true,
           required: true,
           validate: [validator.isEmail, 'Please fill a valid email address']},
    password: {type: String, required: true}
}));