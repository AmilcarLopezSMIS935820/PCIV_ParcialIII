const mongoose = require('mongoose');
const { router } = require('../app');
const Schema = mongoose.Schema;

const clientSchema = new Schema({
    campo1: String,
    campo2: String
});

const Client = mongoose.model('Client', clientSchema);



module.exports = Client;