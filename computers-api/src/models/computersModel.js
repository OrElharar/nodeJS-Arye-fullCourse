const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const validator = require('validator');

const computerSchema = new mongoose.Schema({
    manufacturer: {
        type: String,
        trim: true,
        require: true
    },
    processor: {
        type: String,
        trim: true,
        require: true
    },
    ramMemory: {
        type: String,
        trim: true,
        require: true
    },
    screenSizeInInches: {
        type: Number,
        min: 0,
        trim: true,
        require: true
    },
    priceInShekels: {
        type: Number,
        min: 0,
        trim: true,
        require: true
    }
}, {
    timestamps: true,
})
const Computer = mongoose.model("Computer", computerSchema);

module.exports = Computer;