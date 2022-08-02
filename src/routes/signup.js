'use strict';

const { ADMINUSER, ADMINPASS } = process.env;

const express = require('express');
const UserCollection = require('../models/index.js').User;
const router = express.Router();

const bcrypt = require('bcrypt');
const saltRounds = 10;

const validateUser = require('../middleware/validateUser');

router.post('/signup', validateUser, signUp);

async function signUp(req, res) {
  const { username, password } = req.body;
  bcrypt.hash(password, saltRounds, async (err, hash) => {
    if (err) {
      console.log(err);
      throw new Error('something went wrong while creating your account.');
    }
    let appointedRole = 'User';
    if (username === ADMINUSER && password === ADMINPASS) {
      appointedRole = 'Admin';
    }
    //don't send back password so dont need created model
    await UserCollection.create({
      username: username,
      password: hash,
      role: appointedRole,
    });
    res.status(200).send(`New ${appointedRole} created, ${username}!`);
  });
}

module.exports = router;
