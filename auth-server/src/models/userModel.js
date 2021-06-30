const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const validator = require('validator');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Task = require('./taskModel');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        default: "Almoni",
        validate(value) {
            if (value.trim().toLowerCase() === "moshe") {
                throw new Error("Name could not be Moshe!");
            }
        }
    },
    age: {
        type: Number,
        require: true,
        min: 12,
        max: 66,
    },
    email: {
        type: String,
        require: true,
        trim: true,
        lowercase: true,
        unique: true,
        validate(value) {
            if (!(validator.isEmail(value))) {
                throw new Error("Invalid Email address")
            }
        }
    },
    password: {
        type: String,
        require: true,
        minlength: 7,
        validate(value) {
            const passwordRegix = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{7,}$/
            if (!(passwordRegix.test(value))) {
                throw new Error("Invalid password! Must include lowerer and upper case letters, and numbers")
            }
        }

    },
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ]
}, {
    timestamps: true,
});
userSchema.plugin(uniqueValidator);
userSchema.pre("save", async function (next) {//Need to do binding with "this", that's why not using =>{}function
    const user = this;
    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});
userSchema.statics.findUserByEmailAndPassword = async (email, password) => {
    const user = await User.findOne({ email });
    if (user == null) {
        throw new Error("unable to login");
    }
    const isPassMatch = await bcrypt.compare(password, user.password);
    if (!isPassMatch) {
        throw new Error("unable to login");
    }
    return user;
}

userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign(
        {
            _id: user._id
        },
        process.env.TOKEN_SECRET,
        {
            expiresIn: "3h"
        }
    );
    // user.tokens = user.tokens.concat({ token });
    user.tokens.push({ token });
    await user.save();
    return token;
}

userSchema.methods.toJSON = function () {
    const user = this;
    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.tokens;

    return userObj;
}

userSchema.virtual("tasks", {
    ref: "Task",
    localField: "_id",
    foreignField: "user"
})

userSchema.pre("remove", async function (next) {
    const user = this;
    await Task.deleteMany({ user: user._id });
    next();
})
const User = mongoose.model("User", userSchema);

module.exports = User;