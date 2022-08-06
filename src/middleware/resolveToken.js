'use strict';

const SECRET = process.env.SECRET;

const jwt = require('jsonwebtoken');

const resolveToken = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  const validToken = jwt.verify(token, SECRET);
  if (!validToken) {
    res.status(403).send('Incorrect authentication');
  }
  req.userToken = validToken;
  next();
};

module.exports = resolveToken;
