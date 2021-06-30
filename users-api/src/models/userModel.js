const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const validator = require('validator');


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

    }
}, {
    timestamps: true,
});
userSchema.plugin(uniqueValidator);
const User = mongoose.model("User", userSchema);
module.exports = User;