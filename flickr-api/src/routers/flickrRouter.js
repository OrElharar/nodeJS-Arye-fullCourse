const express = require("express");
const search = require('../utils/search')
const interestingness = require('../utils/interestingness')
const router = new express.Router();

router.get('/interestingness', async (req, res) => {
    try {
        const interestingnessData = await interestingness();
        res.send(interestingnessData)
    } catch (error) {
        res.status(error.status).send(error)
    }
})
module.exports = router;
router.get('/search/:input', async (req, res) => {
    const input = req.params.input;
    try {
        const searchData = await search(input);
        res.send(searchData)
    } catch (error) {
        res.status(204).send(error.error)
    }
})
module.exports = router;