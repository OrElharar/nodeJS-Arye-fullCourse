const express = require('express');
const cors = require("cors");
const path = require("path");

const port = process.env.PORT;
const flickrRouter = require('./routers/flickrRouter');
const imagesRouter = require('./routers/imagesRouter');
const publicDirectoryPath = path.join(__dirname, "../public");
require('./db/mongoose');

const app = express();

app.use(express.static(publicDirectoryPath));
app.use(express.json());
app.use(cors());
app.use(flickrRouter);
app.use(imagesRouter);

app.listen(port, () => {
    console.log("Server connected, port:", port)
})