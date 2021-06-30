const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});

const userSchema = new mongoose.Schema({
    name: {
        type: String
    },
    age: {
        type: Number
    }
});

const User = mongoose.model("User", userSchema);
const or = new User({
    name: "Or",
    age: 27
})
const dror = new User({
    name: "Dror",
    age: 27
})
or.save().then(() => {
    console.log("Success", or);
}).catch((err) => {
    console.log(err);
})
dror.save().then(() => {
    console.log("Success", dror);
}).catch((err) => {
    console.log(err);
})