'use strict';

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
    //don't send back password so dont need created model
    await UserCollection.create({
      username: username,
      password: hash,
    });
    res.status(200).send(`New account created, ${username}!`);
  });
}

module.exports = router;
