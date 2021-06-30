const mongoose = require('mongoose');


const imageSchema = new mongoose.Schema({
    src: {
        type: String
    },
    alt: {
        type: String
    }
}, {
    timestamps: true
});

const Image = mongoose.model("Image", imageSchema);

module.exports = Image;

