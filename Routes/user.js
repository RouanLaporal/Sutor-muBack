const express = require('express');
const router  = express.Router();
const userCtr = require ('../Controllers/user');

router.post('/signup', userCtr.signup);
router.post('login', userCtr.login);

module.exports = router;