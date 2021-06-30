const express = require('express');
const User = require("../models/userModel");
const router = new express.Router();

router.post("/users/new", async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        res.send(user);// shortcut of => res.status(200).send(user)
    } catch (error) {
        res.status(400).send({
            status: 400,
            message: error.message
        })
    }
})

router.get("/user/get", async (req, res) => {
    const _id = req.query._id;
    try {
        const user = await User.findById(_id);
        console.log(user);
        if (user == null) {
            return res.status(404).send({
                status: 404,
                message: "Wrong ID"
            })
        }
        res.send(user);
    } catch (err) {
        res.status(500).send(err);
    }
})

router.get("/users-list", async (req, res) => {
    try {
        const usersArr = await User.find({});
        if (usersArr.length === 0)
            return res.status(404).send({
                status: 404,
                message: "No registered users"
            });
        res.send(usersArr);

    } catch (error) {
        res.status(500).send(error)
    }
})

router.patch("/users/edit", async (req, res) => {
    const _id = req.query.id;
    const reqObj = req.body;
    const editedUser = new User(reqObj)
    const isReqObjValid = () => {
        for (let property in reqObj)
            if (!(property in editedUser))
                return false;
        return true;
    }
    if (!(isReqObjValid()))
        return res.status(400).send({
            status: 400,
            message: "Invalid user properties"
        });
    try {
        // const cloneUser = new User(reqObj);
        // await cloneUser.save();
        const user = await User.findByIdAndUpdate(_id, req.body, {
            new: true, // return new document
            context: 'query',
            runValidators: true // run Schema's validators
        })
        if (user == null) {
            return res.status(404).send({
                status: 404,
                message: "Invalid ID"
            })
        }
        res.send(user);
    } catch (err) {
        res.status(400).send(err.message);

    }
})

router.delete("/users/delete", async (req, res) => {
    const _id = req.query.id;
    try {
        const user = await User.findByIdAndDelete(_id);
        if (user == null) {
            return res.status(404).send({
                status: 404,
                message: "Wrond ID"
            })
        }
        res.send(user);
    } catch (err) {
        res.status(500).send(err)
    }
})
router.get("/users/search", async (req, res) => {
    const reqSearchObj = req.body;
    const allowedProperties = ["name", "email", "password", "age"]
    const isReqObjValid = () => {
        for (let property in reqSearchObj)
            if (!(allowedProperties.includes(property)))
                return false;
        return true;
    }
    if (!(isReqObjValid()))
        return res.status(400).send({
            status: 400,
            message: "Invalid search"
        })

    try {
        const searchedUsersArr = await User.find({ ...reqSearchObj })
        if (searchedUsersArr.length === 0)
            return res.status(404).send({
                status: 404,
                message: "No results"
            })
        res.send(searchedUsersArr);
    } catch (error) {
        res.status(500).send(error.message)
    }
})
module.exports = router;