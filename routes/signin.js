const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const knex = require('knex')(require('../knexfile').development);
require('dotenv').config();

router.post('/signin', (req, res) => {
  const { email, password } = req.body;

  knex('users')
    .select('id', 'email', 'password')
    .then((data) => {
      const users = [...data];
      const user = users.find((user) => {
        return user.email === email;
      });

      bcrypt.compare(password, user.password).then((result) => {
        console.log(result);
        if (result == true) {
          const token = jwt.sign({ name: user.email }, process.env.SECRET_KEY);
          res.json({ token });
        } else {
          res.status(401).json({
            error: {
              message: 'Login failed',
            },
          });
        }
      });
    });
});
module.exports = router;
