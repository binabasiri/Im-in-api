const express = require('express');
const router = express.Router();
const knex = require('knex')(require('../knexfile').development);
const bcrypt = require('bcrypt');
const saltRounds = 5;

router.post('/signup', (req, res) => {
  // grab the username/password
  // populate the user into some persistent thing

  bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
    // Store hash in your password DB.
    let userInfo = { ...req.body, password: hash };

    knex('users')
      .insert(userInfo)
      .then((data) => {
        // For POST requests we need to respond with 201 and the location of the newly created record
        const newUserURL = `/profile/${data[0]}`;

        res.status(201).location(newUserURL).send(newUserURL);
      });
  });
});
module.exports = router;
