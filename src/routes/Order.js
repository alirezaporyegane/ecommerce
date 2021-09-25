const router = require('express').Router();
const { Auth, authentication, Admin } = require('../http/middleware/VerifyToken')
const Order = require('../modules/Order');
const _ = require('lodash');

// CREATE ORDERS
router.post('/', [Auth], (req, res) => {
  const order = new Order(_.pick(req.body,  ['userId', 'products', 'amount', 'address', 'status']))
  
  order.save()
    .then(result => {
      res.status(200).json(_.pick(result,['userId', 'products', 'amount', 'address', 'status']))
    })
    .catch(err => {
      res.status(500).json({
        error: err,
        code: 500
      })
    })
})

// UPDATE ORDERS
router.put('/:id', [Auth, authentication], (req, res) => {
  Order.findByIdAndUpdate(req.params.id, {
    $set: req.body
  }, { new: true })
    .then(result => {
      res.status(200).json(_.pick(result, ['userId', 'products', 'amount', 'address', 'status']))
    })
    .catch(err => {
      res.status(500).json({
        error: err,
        code: 500
      })
    })
})

// DELETE ORDERS
router.delete('/:id', [Auth, authentication], (req, res) => {
  Order.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(200).json({
        msg: 'Order is delete'
      })
    })
    .catch(err => {
      res.status(500).json({
        error: err,
        code: 500
      })
    })
})


// GET ONE ORDERS
router.get('/:id', [Auth, authentication], (req, res) => {
  Order.find({ userId: req.params.id })
    .then(result => {
      res.status(200).json(_.pick(result, ['userId', 'products', 'amount', 'address', 'status']))
    })
    .catch(err => {
      res.status(500).json({
        error: err,
        code: 500
      })
    })
})

// GET ALL ORDERS
router.get('/', [Auth, Admin], (req, res) => {
  Order.find()
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

//GET ORDERS STATUS
router.get('/order/status', [Auth, Admin], (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1))
  const prevMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1))

  User.aggregate([
    {$match: { createdAt: { $gte: prevMonth } }},
    {
      $project: {
        month: { $month: '$createdAt' },
        sales: '$amount'
      }
    },
    {
      $group: {
        _id: "$month",
        total: { $sum: '$sales' }
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