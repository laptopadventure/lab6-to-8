'use strict';

const SECRET = process.env.SECRET;

const jwt = require('jsonwebtoken');

const resolveToken = (req, res, next) => {
  const validToken = jwt.verify(req.headers.auth, SECRET);
  if (!validToken) {
    res.status(403).send('Incorrect authentication');
  }
  res.userToken = validToken;
  next();
};

module.exports = resolveToken;
