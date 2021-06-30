const express = require("express");
const geocode = require('../utils/geocode')
const forcast = require('../utils/forcast')
const router = new express.Router();
const Weather = require('../models/weatherModel');

router.get('/weather/:city', async (req, res) => {
    const city = req.params.city;
    try {
        const geoCodeData = await geocode(city);
        const {
            temprature,
            humidity,
            windSpeed,
            description
        } = await forcast(geoCodeData.longitude, geoCodeData.latitude);

        const weatherDocument = new Weather({
            city,
            temprature,
            humidity,
            windSpeed,
            description
        })
        await weatherDocument.save();
        res.send(weatherDocument);
    } catch (error) {
        if (error.status === 404) {
            res.status(404).send(error);
        }

    }

})

router.get('/weather-history/:city', async (req, res) => {
    const city = req.params.city;
    try {
        const history = await Weather.find({ city });
        if (history.length > 0)
            res.send(history);
        else
            res.send({
                message: "No search history"
            });
    } catch (error) {
        res.status(400).send({
            message: error.message
        })
    }
})

router.post('/actualTemp/:city', async (req, res) => {
    const city = req.params.city;
    const actualTemp = req.query.actualTemp;
    try {

        if (actualTemp != null) {

            const geoCodeData = await geocode(city);
            const {
                temprature,
                humidity,
                windSpeed,
                description
            } = await forcast(geoCodeData.longitude, geoCodeData.latitude);
            const weatherDocument = new Weather({
                city,
                temprature,
                humidity,
                windSpeed,
                description,
                actualTemp
            })
            await weatherDocument.save();
            res.send(weatherDocument);
        } else {
            res.status(400).send({
                message: "lack of actualTemp"
            });
        }

    } catch (error) {
        if (error.status === 400)
            res.send(error)
    }
});
module.exports = router;
