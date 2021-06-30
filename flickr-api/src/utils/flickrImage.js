const axios = require('axios');
const flickrImage = async (url) => {
    const token = process.env.FLICKR_TOKEN;
    url += `&extras=url_m&api_key=${token}`;
    try {
        const result = await axios.get(url);
        const intrestingImagesArr = [];
        result.data.photos.photo.forEach(element => {
            intrestingImagesArr.push(element.url_m);
        });
        if (intrestingImagesArr.length > 0)
            return {
                status: 200,
                data: intrestingImagesArr
            }
        else
            throw {
                status: 204,
                message: "Empty content"
            }
    } catch (error) {
        if (error != null) {
            throw {
                error
            };
        }
        else throw error;
    }
}
module.exports = flickrImage;
