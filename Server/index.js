require('dotenv').config();
const express = require('express');
const connectDB = require('./db');
const Auth = require('./Routes/Auth');

const app = express();
app.use(express.json());

// app.get('/', (_req, res) => res.send('test'));
app.use('/auth', Auth);

const PORT = process.env.PORT || 3000;

(async () => {
  await connectDB(process.env.MONGODB_URI);
  app.listen(PORT, () => console.log(`Server started on ${PORT} 👍`));
})();
