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
  const query = req.params.new
  query ? User.find.sort({ _id: -1 }).limit(5) : User.findById(req.params.id)
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
  const query = req.query.new
  query ? 
  User.find(req.params.id).sort({ _id: -1 }).limit(5).select('email username createdAt updatedAt') 
  : User.find(req.params.id).select('email username createdAt updatedAt')  
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


//GET USER STATUS
router.get('/user/status', [Auth, Admin], (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear() - 1)

  User.aggregate([
    {$match: { createdAt: { $gte: lastYear } }},
    {
      $project: {
        month: { $month: '$createdAt' }
      }
    },
    {
      $group: {
        _id: "$month",
        total: { $sum: 1 }
      }
    }
  ])
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