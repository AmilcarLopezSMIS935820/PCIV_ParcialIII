const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    fullName: String,
    email: String,
    password: String
})


//Crear modelo
const User = mongoose.model('User', userSchema);

module.exports = User;