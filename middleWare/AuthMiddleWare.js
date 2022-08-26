const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

function authorize(req, res, next) {
  let token = req.headers.authorization?.slice('Bearer '.length);

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'No token' });
    } else {
      req.decoded = decoded;
      return next();
    }
  });
}

module.exports = {
  authorize,
};
