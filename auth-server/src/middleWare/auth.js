const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const auth = async (req, res, next) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "");
        const data = jwt.verify(token, process.env.TOKEN_SECRET);

        const user = await User.findOne({
            _id: data._id,
            "tokens.token": token, //Mongo provide option to search element in array using array.element
        })
        if (user == null) {
            throw new Error();
        }
        req.user = user;
        req.token = token;
        next();
    } catch (error) {
        res.status(400).send({
            status: 400,
            message: "Authorization failed"
        })
    }

}
module.exports = auth;