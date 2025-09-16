require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./utils/db');

const Auth = require('./Routes/auth.routes');
const Contacts = require('./Routes/contact.routes');
const { initSwagger } = require('./utils/swagger');

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: false,
}));

app.use(express.json());

// API
app.use('/api/auth', Auth);
app.use('/api/contacts', Contacts);

// Swagger
initSwagger(app);

const PORT = process.env.PORT || 3000;

(async () => {
  await connectDB(process.env.MONGODB_URI);
  app.listen(PORT, () => console.log(`Server started 👍 on :${PORT}`));
})();
