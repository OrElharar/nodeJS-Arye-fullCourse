const flickrImage = require("./flickrImage");
const search = async (input) => {
    url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&text=${input}&format=json&nojsoncallback=1`
    try {
        const result = await flickrImage(url);
        console.log(result)
        if (result.status === 200)
            return result
        else
            throw result

    } catch (error) {
        throw error
    }
}
// search("gym").then((res) => {
//     console.log(res);
// }).catch((err) => {
//     console.log(err);
// })
module.exports = search;