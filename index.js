const express = require('express');
const cors = require('cors');
const search = require('./routes/search');
const city = require('./routes/city');
const register = require('./routes/register');
const photo = require('./routes/photo');
const signin = require('./routes/signin');
const trips = require('./routes/trips');
const profile = require('./routes/profile');
const explore = require('./routes/explore');
const app = express();

require('dotenv').config();

const { PORT, GOOGLE_API_KEY } = process.env;

app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.status(200).send('WELCOME');
});

app.use('/', search);
app.use('/', city);
app.use('/', register);
app.use('/', photo);
app.use('/', signin);
app.use('/', trips);
app.use('/', profile);
app.use('/', explore);

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
