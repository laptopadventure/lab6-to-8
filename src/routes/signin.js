'use strict';

const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');

const User = require('../models/index').User.model;

router.put('/signin', signIn);

async function signIn(req, res) {
  const { username, password } = req.body;
  const user = User.findOne({ where: { username: username } });
  if (!user) {
    res.status(404).send('No user with that name.');
  }
  const validLogin = bcrypt.compare(password, user.password);
  if (!validLogin) {
    res.status(403).send('Incorrect password.');
  }
  res.status(200).send({ user: user.username, token: user.token });
}

module.exports = router;
