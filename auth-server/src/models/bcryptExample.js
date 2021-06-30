const bcrypt = require('bcryptjs');
const password = "mypassword123";
const jwt = require("jsonwebtoken");
const hashPassword = async (password) => {
    const hashPass = await bcrypt.hash(password, 8);
    // console.log(hashPass);
    const isMatch = await bcrypt.compare(password, hashPass);
    console.log(hashPass);
}
// hashPassword(password).then();

const func = () => {
    const token = jwt.sign(
        {
            _id: "usersId",
        },
        "thisIsMySecret",
        {
            expiresIn: "3h",
        }
    );
    console.log(token);
    const data = jwt.verify(token, "thisIsMySecret");
    console.log(data)
}
func();