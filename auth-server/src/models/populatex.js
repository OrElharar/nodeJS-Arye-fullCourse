const mongoose = require('mongoose');
const Task = require("./taskModel");
const User = require("./userModel")
mongoose.connect(process.env.MONGODB_URl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});

const populate = async () => {
    // const task = await Task.findById("60d86e31785d2c2d0cd67cd3");
    // const user = await User.findById(task.user); //option 1
    // console.log(user);
    // await task.populate("user").execPopulate(); // option 2
    // console.log(task.user.name);
    const user = await User.findById("60d835faa4e4be31d040182c");
    await user.populate("tasks").execPopulate();
    console.log(user.tasks);
}
populate().then();