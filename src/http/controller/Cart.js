const Cart = require('../../models/Cart'),
mongoose = require('mongoose'),
_ = require('lodash');

class cartController {

  // GET ALL COUNT
  async getAll (req, res) {
    Cart.find()
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
  
  // GET ONE CART
  async getById (req, res) {
    const id = req.params.id

    if (!mongoose.isValidObjectId(id)) 
      return res.status(400).json({
        msg: 'Request Faild',
        code: 400
      })

    Cart.findOne({ userId: id })
      .then(result => {
        res.status(200).json(_.pick(result, ['userId', 'products']))
      })
      .catch(err => {
        res.status(500).json({
          error: err,
          code: 500
        })
      })
  }

  // POST CART
  async create (req, res) {
    const cart = new Cart(_.pick(req.body,  ['userId', 'products']))
  
    cart.save()
      .then(result => {
        res.status(200).json(_.pick(result,['userId', 'products']))
      })
      .catch(err => {
        res.status(500).json({
          error: err,
          code: 500
        })
      })
  }

  // UPDATE CART
  async update (req, res) {
    const id = req.params.id

    if (!mongoose.isValidObjectId(id)) 
      return res.status(400).json({
        msg: 'Request Faild',
        code: 400
      })

    Cart.findByIdAndUpdate(id, {
        $set: req.body
      }, { new: true })
        .then(result => {
          res.status(200).json(_.pick(result, ['userId', 'products']))
        })
        .catch(err => {
          res.status(500).json({
            error: err,
            code: 500
          })
        })
  }

  // DELETE CART
  async delete (req, res) {
    const id = req.params.id

    if (!mongoose.isValidObjectId(id)) 
      return res.status(400).json({
        msg: 'Request Faild',
        code: 400
      })

    Cart.findByIdAndDelete(id)
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


module.exports = new cartController()