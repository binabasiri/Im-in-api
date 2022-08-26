const express = require('express');
const router = express.Router();
const knex = require('knex')(require('../knexfile').development);
const bcrypt = require('bcrypt');
const saltRounds = 5;
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

router.post('/register', (req, res) => {
  // grab the username/password
  // populate the user into some persistent thing

  let id = uuidv4();
  bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
    // Store hash in your password DB.
    const { userName, email } = req.body;

    let userInfo = { id, email, password: hash, user_name: userName };

    knex('users')
      .insert(userInfo)
      .then((data) => {
        // For POST requests we need to respond with 201 and the location of the newly created record
        console.log(data);
        const token = jwt.sign({ id }, process.env.SECRET_KEY);
        res.json({ token, user: { id, email, user_name: userName } });
      });
  });
});
module.exports = router;
