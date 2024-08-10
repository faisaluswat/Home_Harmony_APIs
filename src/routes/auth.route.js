const express = require('express');
const { login } = require('../handlers/auth.handler');

const router = new express.Router();

router.get('/login', login);

module.exports = router