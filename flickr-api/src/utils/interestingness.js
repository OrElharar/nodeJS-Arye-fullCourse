const flickrImage = require("./flickrImage");
const intrestingness = async () => {
    const url = "https://www.flickr.com/services/rest/?method=flickr.interestingness.getList&format=json&nojsoncallback=1";
    try {
        const result = await flickrImage(url);
        if (result.status === 200)
            return result
        else
            throw result

    } catch (error) {
        throw error;
    }
}

// intrestingness().then((res) => {
//     console.log(res);
// }).catch((err) => {
//     console.log(err);
// })
module.exports = intrestingness;