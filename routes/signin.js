const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const knex = require('knex')(require('../knexfile').development);
require('dotenv').config();
// const { authorize } = require('../middleWare/AuthMiddleWare');

router.post('/signin', (req, res) => {
  const { email, password } = req.body;
  knex('users')
    .select('id', 'email', 'password', 'user_name')
    .then((data) => {
      const users = [...data];
      const user = users.find((user) => {
        return user.email === email;
      });
      if (user) {
        const { id, email, user_name } = user;
        bcrypt.compare(password, user.password).then((result) => {
          if (result == true) {
            const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY);
            res.json({ token, user: { id, email, user_name } });
          } else {
            res.status(401).json({
              error: {
                message: 'Login failed',
              },
            });
          }
        });
      } else {
        res.status(401).json({
          error: {
            message: "User doesn't exist",
          },
        });
      }
    });
});
module.exports = router;
