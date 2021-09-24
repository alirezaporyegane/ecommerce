const router = require('express').Router();
const { Auth, authentication } = require('../middleware/VerifyToken')
const cryptoJS = require('crypto-js');
const User = require('../modules/User');
const _ = require('lodash');


router.put('/:id', [Auth, authentication], (req, res) => {
  const password = req.body.password
  if (password) {
    password = cryptoJS.AES.encrypt(
      password,
      process.env.PASS_SEC
    ).toString()
  }

  User.findByIdAndUpdate(req.params.id, {
    $set: req.body
  }, { new: true })
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