const express = require('express');
const userRouter = require('./controller/userRouter');
const ticketRouter = require('./controller/ticketRouter');
const logger = require('./util/logger');

const app = express();
const PORT = 3000;
const secretKey = process.env.P1_SECRET_KEY;

//TODO: implement password encryption and jwt


app.use(express.json());
app.use((req, res, next) => {
    logger.info(`${req.method} request at ${req.url}`);
    next();
});
app.use('/users', userRouter);
app.use('/tickets', ticketRouter);

app.get('/', (req, res) => {
    res.send("Hello World");
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})