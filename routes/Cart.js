const router = require('express').Router();
const { Auth, authentication, Admin } = require('../middleware/VerifyToken')
const Cart = require('../modules/Cart');
const _ = require('lodash');

// CREATE CART
router.post('/', [Auth], (req, res) => {
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
})

// UPDATE CART
router.put('/:id', [Auth, authentication], (req, res) => {
  Cart.findByIdAndUpdate(req.params.id, {
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
})

// DELETE CART
router.delete('/:id', [Auth, authentication], (req, res) => {
  Cart.findByIdAndDelete(req.params.id)
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


// GET ONE CART
router.get('/:id', [Auth, authentication], (req, res) => {
  Cart.findOne({ userId: req.params.id })
    .then(result => {
      res.status(200).json(_.pick(result, ['userId', 'products']))
    })
    .catch(err => {
      res.status(500).json({
        error: err,
        code: 500
      })
    })
})

// GET ALL CART
router.get('/', [Auth, Admin], (req, res) => {
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
})


module.exports = router