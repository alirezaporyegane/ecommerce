const router = require('express').Router();
const User = require('../modules/User');
const _ = require('lodash');
const jwt = require('jsonwebtoken')
const cryptoJS = require('crypto-js');
// REGISTER
router.post('/register', (req, res) => {
  const hash = cryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC)
  const newUser = new User({..._.pick(req.body, ['username', 'email']), 
  password: hash
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

//LOGIN
router.post('/login', (req, res) => {
  User.findOne({ username: req.body.username })
    .then(user => {
      !user && res.status(401).json({
        msg: 'this user not Found',
        code: 401
      })
      const hash = cryptoJS.AES.decrypt(user.password, process.env.PASS_SEC)
      const password = hash.toString(cryptoJS.enc.Utf8);

      password !== req.body.password && res.status(401).json({
        msg: 'pass not correct',
        code: 401
      })

      const accessToken = jwt.sign({
        id: user._id,
        isAdmin: user.isAdmin
      }, process.env.TOKEN_SEC, { expiresIn: "3d" } )

      res.status(200).json({ ..._.pick(user, ['username', 'email']), code: 200, token: accessToken })
    })
    .catch(err => {
      res.status(500).json({
        error: err,
        code: 500
      })
    })
})


module.exports = router