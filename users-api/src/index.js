const express = require('express');
const cors = require('cors')
const usersRouter = require('./routers/usersRouter')

const port = process.env.PORT;

const app = express();

require('./db/mongoose');

app.use(express.json());
app.use(cors());
app.use(usersRouter);



app.listen(port, () => {
    console.log("Server connected, Port ", port);
})