const cryptoJS = require('crypto-js'),
mongoose = require('mongoose'),
User = require('../../models/User'),
_ = require('lodash');

class userController {

  // GET ALL USER
  async getAll (req, res) {
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
  }

  // GET COUNT
  async getCount (req, res) {
    User.find().countDocuments()
      .then(result => {
        res.status(200).json(result)
      })
      .catch(err => {
        res.status(500).json({
          error: err,
          code: 500
        })
      })
  }

  // GET ONE USER
  async getById (req, res) {
    const id = req.params.id

    if (!mongoose.isValidObjectId(id)) 
      return res.status(400).json({
        msg: 'Request Faild',
        code: 400
      })

    User.findById(id)
      .then(result => {
        res.status(200).json(_.pick(result, ['_id','email', 'username', 'createdAt', 'updatedAt']))
      })
      .catch(err => {
        res.status(500).json({
          error: err,
          code: 500
        })
      })
  }

  // GET STATUS
  async getStatus (req, res) {
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
  }

  // UPDATE USER
  async update () {
    const password = req.body.password
    const id = req.params.id

    if (password) {
      password = cryptoJS.AES.encrypt(
        password,
        process.env.PASS_SEC
      ).toString()
    }

    if (!mongoose.isValidObjectId(id)) 
      return res.status(400).json({
        msg: 'Request Faild',
        code: 400
      })
  
    User.findByIdAndUpdate(id, {
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
  }

  // DELETE USER 
  async delete () {
    const id = req.params.id

    if (!mongoose.isValidObjectId(id)) 
      return res.status(400).json({
        msg: 'Request Faild',
        code: 400
      })

    User.findByIdAndDelete(id)
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
  }
}

module.exports = new userController()