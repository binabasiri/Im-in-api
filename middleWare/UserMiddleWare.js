const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

function userMiddleWare(req, res, next) {
  if (req.headers.authorization) {
    let token = req.headers.authorization.slice('Bearer '.length);
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
        return next();
      } else {
        req.decoded = decoded;
        return next();
      }
    });
  } else {
    req.decoded = { id: null };
    return next();
  }
}

module.exports = {
  userMiddleWare,
};
