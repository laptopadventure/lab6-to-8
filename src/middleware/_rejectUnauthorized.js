'use strict';

//this authorizes via headers, which is done in lab 7. sorry, my bad! ignore it for now.

const base64 = require('base-64');
const bcrypt = require('bcrypt');

const User = require('../models/index.js').User.model;

//does all the auth checks for authorized routes, rejecting those with no account.
const _rejectUnauthorized = async (req, res, next) => {
  if (!req.headers.authorization) {
    res
      .status(403)
      .send('You need to supply your username and password to authorize.');
    return;
  }
  //get the user and pass sent in
  let basicHeaderParts = req.headers.authorization.split(' '); // ['Basic', 'sdkjdsljd=']
  let encodedString = basicHeaderParts.pop(); // sdkjdsljd=
  let decodedString = base64.decode(encodedString); // "username:password"
  let [username, plainPassword] = decodedString.split(':'); // username, password

  //see if they are correct
  const foundUser = await User.findOne({ where: { username: username } });
  if (!foundUser) {
    throw new Error('No user found with that name.');
  }
  bcrypt.compare(plainPassword, foundUser.password, (err, result) => {
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

module.exports = _rejectUnauthorized;
