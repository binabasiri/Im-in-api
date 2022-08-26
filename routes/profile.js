const express = require('express');
const router = express.Router();
const { authorize } = require('../middleWare/AuthMiddleWare');
const knex = require('knex')(require('../knexfile').development);
router.get('/profile', authorize, (req, res) => {
  knex('users')
    .select('id', 'email', 'user_name')
    .where('id', req.decoded.id)
    .then((user) => res.json(user[0]));
});
module.exports = router;
