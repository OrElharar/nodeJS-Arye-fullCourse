const express = require('express');
const cors = require('cors');
const computersRouter = require('./routers/computersRouter');

const port = process.env.PORT;

const app = express();

require('./db/mongoose');

app.use(express.json());
app.use(cors());
app.use(computersRouter);



app.listen(port, () => {
    console.log("Server connected, Port ", port);
})