'use strict';

//this authorizes via body, which is what I should have done first.

const bcrypt = require('bcrypt');

const User = require('../models/index.js').User.model;

//does all the auth checks for authorized routes, rejecting those with no account.
const rejectUnauthorized = async (req, res, next) => {
  console.log(req.body);
  //get the user and pass sent in
  const { username, password } = req.body;
  if (!username || !password) {
    res
      .status(403)
      .send('You need to supply your username and password to authorize.');
    return;
  }

  //see if they are correct
  const foundUser = await User.findOne({ where: { username: username } });
  if (!foundUser) {
    throw new Error('No user found with that name.');
  }
  bcrypt.compare(password, foundUser.password, (err, result) => {
    if (err) {
      throw new Error('Something went wrong while authorizing you.');
    }
    if (!result) {
      throw new Error('Incorrect password.');
    }
  });
  req.authorizedUser = foundUser;
  next();
};

module.exports = rejectUnauthorized;
