const express = require("express");
const { Query } = require("mongoose");
const router = new express.Router();
const Image = require('../models/imagesModel');

router.get('/images-history', async (req, res) => {
    try {
        const history = await Image.find({});
        if (history.length > 0)
            res.send({
                status: 200,
                data: history
            });
        else
            res.send({
                message: "No history uploads"
            });
    } catch (error) {
        res.status(400).send({
            message: error.message
        })
    }
})

router.post('/image-upload', async (req, res) => {
    const alt = (req.query.alt != "") ? req.query.alt : "No description";
    const src = req.query.src;
    try {

        if (src != null) {
            const imageDocument = new Image({
                alt,
                src
            })
            await imageDocument.save();
            res.send(imageDocument);
        } else {
            res.status(400).send({
                message: "lack of source"
            });
        }

    } catch (error) {
        if (error.status === 400)
            res.send(error)
    }
});
module.exports = router;

