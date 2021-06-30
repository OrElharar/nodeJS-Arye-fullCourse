const mongoose = require('mongoose');

const weatherSchema = new mongoose.Schema({
    city: {
        type: String
    },
    temprature: {
        type: String
    },
    humidity: {
        type: String
    },
    wind: {
        type: String
    },
    description: {
        type: String
    },
    actualTemp: {
        type: String,
        default: "Not entered"
    }
}, {
    timestamps: true

});
const Weather = mongoose.model("weather", weatherSchema);

module.exports = Weather;