const axios = require('axios');
const geocode = async (city) => {
    const token = process.env.MAPBOX_TOKEN;
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${city}.json?access_token=${token}&limit=1`

    try {
        const result = await axios.get(url);
        if (result.data.features.length > 0)
            return {
                longitude: result.data.features[0].center[0],
                latitude: result.data.features[0].center[1],
                cityName: result.data.features[0].place_name
            }
        else
            throw {
                statuse: "404",
                message: "Place not found"
            }
    } catch (error) {
        throw error;

    }
}
// geocode("sfdsjkksb").then((res) => {
//     console.log(res);
// }).catch((err) => {
//     console.log(err);
// })
module.exports = geocode;