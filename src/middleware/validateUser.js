'use strict';

//validates user data sent in, rejecting bad req bodies.
const validateUser = (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new Error('missing username or password for new account.');
  }
  next();
};

module.exports = validateUser;
