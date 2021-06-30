const express = require("express");
const auth = require("../middleWare/auth");
const Task = require("../models/taskModel");

const router = new express.Router();

const allowedProperties = ["description", "isCompleted"]
const isValidReqObj = (obj) => {
    for (let property in obj)
        if (!(allowedProperties.includes(property)))
            return false;
    return true;
}
router.post("/tasks/new", auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        user: req.user._id
    });
    try {
        await task.save();
        return res.send(task);
    } catch (err) {
        res.status(400).send(err)
    }
})

router.get("/tasks/get", auth, async (req, res) => {
    const _id = req.query.id;
    try {
        const task = await Task.findOne({ _id, user: req.user._id })
        if (task == null) {
            return res.status(404).send({
                status: 404,
                message: "No task"
            })
        }
        res.sent(task);
    } catch (err) {
        res.status(500).send(err);
    }
})

router.delete("tasks/delete", auth, async (req, res) => {
    const _id = req.query._id;
    const user_Id = req.user._id;
    try {
        const task = await Task.findOneAndDelete({ _id, user: user_Id });
        if (task == null) {
            res.statue(404).send({
                status: 404,
                message: "No task"
            })
            res.send(task);
        }
    } catch (error) {
        res.status(500).send(error);
    }
})

router.patch("tasks/edit", auth, async (req, res) => {
    const reqObj = req.body;
    const _id = req._id;
    if (!(isValidReqObj(reqObj)))
        return res.status(400).send({
            status: 400,
            message: "Invalid fields updated"
        })
    try {
        const task = await Task.findOneAndUpdate({ _id, user: req.user._id }, reqObj, { new: true, runValidators: true })
        if (task == null) {
            return res.status(404).send({
                status: 400,
                message: "Task not found"
            });
        }
        await task.save();
        res.send(task);
    } catch (err) {
        res.status(500).send(err)
    }
})

router.get("/user/all-tasks", auth, async (req, res) => {
    const user = req.user;
    const match = {};
    const options = {};
    if (req.query.isCompleted != null) {
        match.isCompleted = req.query.isCompleted === "true";
    }
    if (req.lomit != null) {
        options.limit = parseInt(req.query.limit)
    }
    if (req.query.skip != null) {
        options.skip = parseInt(req.query.skip);
    }
    if (req.query.sortDate) {
        options.sort = {};
        options.sort.createdAt = req.query.sortDate === "desc" ? -1 : 1;//asc
    }
    try {
        // const tasksArr = await Task.find({ user: req.user._id });//option 1
        // await user.populate("tasks").execPopulate(); option 2
        // const tasksArr = user.tasks;
        await user
            .populate({                                   //option 3
                path: "tasks",
                match,
                options,
            }).execPopulate()
        const tasksArr = user.tasks;
        if (tasksArr.length === 0)
            return res.status(404).send({
                status: 404,
                message: "No tasks"
            });
        return res.send(tasksArr);
    } catch (err) {
        res.status(500).send(err);
    }
})


module.exports = router