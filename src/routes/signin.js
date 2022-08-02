'use strict';

const express = require('express');
const router = express.Router();

const rejectUnauthorized = require('../middleware/rejectUnauthorized');

router.put('/signin', rejectUnauthorized, signIn);

async function signIn(req, res) {
  const user = req.authorizedUser;
  res.status(200).send(user);
}

module.exports = router;
