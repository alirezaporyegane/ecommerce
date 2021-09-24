const router = require('express').Router();
const { Auth, authentication, Admin } = require('../middleware/VerifyToken')
const cryptoJS = require('crypto-js');
const User = require('../modules/User');
const _ = require('lodash');

// UPDATE USER
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

// DELETE USER
router.delete('/:id', [Auth, authentication], (req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(200).json({
        msg: 'user is delete'
      })
    })
    .catch(err => {
      res.status(500).json({
        error: err,
        code: 500
      })
    })
})


// GET ONE USER
router.get('/:id', [Auth, authentication, Admin], (req, res) => {
  User.findById(req.params.id)
    .then(result => {
      res.status(200).json(_.pick(result, ['_id','email', 'username', 'createdAt', 'updatedAt']))
    })
    .catch(err => {
      res.status(500).json({
        error: err,
        code: 500
      })
    })
})

// GET ALL USER
router.get('/', [Auth, Admin], (req, res) => {
  User.find().select('email username createdAt updatedAt')
    .then(result => {
      res.status(200).json(result)
    })
    .catch(err => {
      res.status(500).json({
        error: err,
        code: 500
      })
    })
})


module.exports = router