const router = require('express').Router();
const Auth = require('../http/controller/Auth')


// REGISTER
router.post('/register', Auth.register)

//LOGIN
router.post('/login', Auth.login)


module.exports = router