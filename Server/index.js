require('dotenv').config();

const express = require('express');
const connectDB = require('./utils/db');
const Auth = require('./Routes/auth.routes');

const app = express();
app.use(express.json());

app.use('/auth', Auth);
// app.use('/contact', Contact)

const PORT = process.env.PORT;

(async () => {
  await connectDB(process.env.MONGODB_URI);
  app.listen(PORT, () => console.log(`Server started 👍`));
})();
