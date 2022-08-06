'use strict';

const SECRET = process.env.SECRET;
const jwt = require('jsonwebtoken');

const user = (sequelize, DataTypes) =>
  sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    token: {
      type: DataTypes.VIRTUAL,
      get() {
        const payload = { username: this.username, role: this.role };
        return jwt.sign(payload, SECRET);
      },
    },
  });

module.exports = user;
