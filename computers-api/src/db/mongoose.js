const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});