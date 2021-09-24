const router = require('express').Router();
const User = require('../modules/User');
const _ = require('lodash');
const jwt = require('jsonwebtoken')
const cryptoJS = require('crypto-js');
// REGISTER
router.post('/register', (req, res) => {
  const hash = cryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC)
  const newUser = new User({..._.pick(req.body, ['username', 'email']), 
  passwrd: hash
})

  newUser.save()
    .then(result => {
      res.status(200).json(_.pick(result, ['username', 'email']))
    })
    .catch(err => {
      res.status(500).json({
        error: err,
        code: 500
      })
    })
})


module.exports = router