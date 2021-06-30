const axios = require('axios');
const geocode = require('./geocode')
const forcast = async (longitude, latitude) => {
    const token = process.env.FORCAST_TOKEN;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${token}&units=metric`;
    // const example = "https://api.openweathermap.org/data/2.5/weather?lat=34.78254&lon=32.088545&appid=50d40221f22ed3ab85e642a923f2b04d$units=metric"
    try {
        const result = await axios.get(url);

        return {
            temprature: result.data.main.temp,
            humidity: result.data.main.humidity,
            windSpeed: result.data.wind.speed,
            description: result.data.weather[0].description,


        }

    } catch (error) {
        if (error.data.response != null) {
            throw {
                status: error.data.response.cod,
                message: error.data.response.message
            };
        }
        else throw error;
    }
}
// forcast(34.78254, 32.088545,).then((res) => {
//     console.log(res);
// }).catch((err) => {
//     console.log(err);
// })
getForcast = async (cityName) => {
    try {
        const cordinates = await geocode(cityName);
        const longitude = cordinates.longitude;
        const latitude = cordinates.latitude;
        const forcastObj = await forcast(longitude, latitude);
        return forcastObj;

    } catch (error) {
        throw error;
    }
}
// getForcast("Jerusalem").then((res) => {
//     console.log(res);
// }).catch((err) => {
//     console.log(err);
// })
module.exports = forcast;

