const allowedOrigins = require('../config/allowedOrigins');

//setting on res header - 'Access-Control-Allow-Credentials': true
// to prevent CORS policy error
const credentials = (req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Credentials', true);
  }
  next();
};

module.exports = credentials;
