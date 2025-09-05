const express = require ('express');
const app = express();

const router = express.Router();

const mongoose = require('mongoose');

const Auth = require('./Routes/Auth');

app.use(express.json());
app.use('/auth', Auth);



app.listen(3000, () => {
    console.log('Server started 👍');
});

