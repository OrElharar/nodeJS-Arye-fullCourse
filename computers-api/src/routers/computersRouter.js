const express = require("express");
const Computer = require("../models/computersModel")
const router = new express.Router();

const allowedProperties = ["manufacturer", "processor", "ramMemory", "screenSizeInInches", "priceInShekels"]
const isValidReqObj = (obj) => {
    for (let property in obj)
        if (!(allowedProperties.includes(property)))
            return false;
    return true;
}

router.post("/computers/new", async (req, res) => {
    const reqObj = req.body;
    if (!(isValidReqObj(reqObj)))
        return res.status(400).send({
            status: 404,
            message: "Ivalid properties in the input Object"
        });
    const computer = new Computer(reqObj);
    try {
        await computer.save();
        res.send(computer);
    } catch (error) {
        res.status(500).send(error.message);
    }
})

router.get("/computers/get", async (req, res) => {
    const _id = req.query.id;
    try {
        const computer = await Computer.findById(_id);
        console.log(computer);
        if (computer == null) {
            return res.status(404).send({
                status: 404,
                message: "Wrong ID"
            })
        }
        res.send(computer);
    } catch (err) {
        res.status(500).send(err);
    }
})

router.delete("/computers/delete", async (req, res) => {
    const _id = req.query.id;
    try {
        const computer = await Computer.findByIdAndDelete(_id);
        if (computer == null) {
            return res.status(404).send({
                status: 404,
                message: "Wrond ID"
            })
        }
        res.send(computer);
    } catch (err) {
        res.status(500).send(err)
    }
})

router.patch("/computers/edit", async (req, res) => {
    const _id = req.query.id;
    const reqObj = req.body;

    if (!(isValidReqObj(reqObj)))
        return res.status(400).send({
            status: 400,
            message: "Invalid computer properties"
        });
    try {

        const computer = await Computer.findByIdAndUpdate(_id, req.body, {
            new: true, // return new document
            context: 'query',
            runValidators: true // run Schema's validators
        })
        if (computer == null) {
            return res.status(404).send({
                status: 404,
                message: "Invalid ID"
            })
        }
        res.send(computer);
    } catch (err) {
        res.status(400).send(err.message);

    }
})
router.get("/computer/get-by-price-range", async (req, res) => {
    const maxPrice = req.query.max;
    const minPrice = req.query.min;
    if (!(maxPrice > minPrice && maxPrice > 0))
        return res.status(400).send({
            status: 400,
            message: "Invalid price's range"
        });
    try {
        const computersArr = await Computer.find({ "priceInShekels": { $gte: minPrice, $lte: maxPrice } });
        if (computersArr.length === 0)
            return res.status(404).send({
                status: 404,
                message: "No results match"
            })
        return res.send(computersArr);

    } catch (err) {
        res.status(500).send(err.message)
    }
})

module.exports = router;