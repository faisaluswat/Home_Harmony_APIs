const express = require('express');
const { login } = require('../handlers/auth.handler');
const { mailAuth } = require('../middlewares/passport');

const router = new express.Router();

router.post('/login', mailAuth, login);

module.exports = router