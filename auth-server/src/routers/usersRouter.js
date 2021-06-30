const express = require('express');
const User = require("../models/userModel");
const router = new express.Router();
const auth = require("../middleWare/auth")
router.post("/users/new", async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.send({ user, token });// shortcut of => res.status(200).send(user)
    } catch (error) {
        res.status(400).send({
            status: 400,
            message: error.message
        })
    }
})

router.get("/user/get", auth, async (req, res) => {

    try {
        res.send(req.user);
    } catch (err) {
        res.status(500).send(err);
    }
})

// router.get("/users-list", async (req, res) => {
//     try {
//         const usersArr = await User.find({});
//         if (usersArr.length === 0)
//             return res.status(404).send({
//                 status: 404,
//                 message: "No registered users"
//             });
//         res.send(usersArr);

//     } catch (error) {
//         res.status(500).send(error)
//     }
// })

router.patch("/users/edit", auth, async (req, res) => {
    const _id = req.user.id;
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
        // const user = await User.findByIdAndUpdate(_id, req.body, {
        //     new: true, // return new document
        //     context: 'query',
        //     runValidators: true // run Schema's validators
        // })
        // const user = await User.findById(_id);
        // if (user == null) {
        //     return res.status(404).send({
        //         status: 404,
        //         message: "Invalid ID"
        //     })
        // }
        const user = req.user;
        for (let update in reqObj) {
            user[update] = reqObj[update];
        }
        await user.save();
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
// router.get("/users/search", async (req, res) => {
//     const reqSearchObj = req.body;
//     const allowedProperties = ["name", "email", "password", "age"]
//     const isReqObjValid = () => {
//         for (let property in reqSearchObj)
//             if (!(allowedProperties.includes(property)))
//                 return false;
//         return true;
//     }
//     if (!(isReqObjValid()))
//         return res.status(400).send({
//             status: 400,
//             message: "Invalid search"
//         })

//     try {
//         const searchedUsersArr = await User.find({ ...reqSearchObj })
//         if (searchedUsersArr.length === 0)
//             return res.status(404).send({
//                 status: 404,
//                 message: "No results"
//             })
//         res.send(searchedUsersArr);
//     } catch (error) {
//         res.status(500).send(error.message)
//     }
// })

router.post("/users/login", async (req, res) => {
    const password = req.body.password;
    const email = req.body.email;
    try {
        const user = await User.findUserByEmailAndPassword(email, password);
        const token = await user.generateAuthToken();
        res.send({ user, token });
    } catch (err) {
        res.status(400).send({
            status: 400,
            message: err.message
        });
    }
})

router.post("/users/logout", auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((tokenDoc) => tokenDoc.token !== req.token);
        await req.user.save();
        res.send();
    } catch (err) {
        res.status(500).send(err)
    }
})

router.post("/users/logout-all", auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch (error) {
        res.status(500).send(error)
    }
})

router.get("/users/stay-logged-in", auth, async (req, res) => {
    try {
        const oldToken = req.token;
        req.user.tokens = req.user.tokens.filter((tokenDoc) => tokenDoc.token !== oldToken);
        const user = req.user;
        const newToken = await user.generateAuthToken();

        res.send({ newToken });
    } catch (err) {
        res.status(500).send(err);
    }
})
module.exports = router;