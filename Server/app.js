require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./utils/db');

const Auth = require('./Routes/auth.routes');
const Contacts = require('./Routes/contact.routes');

const app = express();
app.use(cors());
app.use(express.json());

(async () => { await connectDB(process.env.MONGODB_URI); })();

app.use('/api/auth', Auth);
app.use('/api/contacts', Contacts);

module.exports = app;
