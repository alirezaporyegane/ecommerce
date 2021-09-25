const mongoose = require('mongoose'),
_ = require('lodash'),
Order = require('../../models/Order');


class orderController {
  // GET ALL ORDER
  async getAll (req, res) {
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
  }

  // GET COUNT
  async getCount (req, res) {
    Order.find().countDocuments()
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

  // GET STATUS
  async getStatus (req, res) {
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
  }

  // GET ONE ORDER
  async getById (req, res) {
    const id = req.params.id

    if (!mongoose.isValidObjectId(id)) 
      return res.status(400).json({
        msg: 'Request Faild',
        code: 400
      })

    Order.find({ userId: id })
      .then(result => {
        res.status(200).json(_.pick(result, ['userId', 'products', 'amount', 'address', 'status']))
      })
      .catch(err => {
        res.status(500).json({
          error: err,
          code: 500
        })
      })
  }

  // POST ORDER
  async create (req, res) {
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
  }

  // UPDATE ORDER
  async update (req, res) {
    const id = req.params.id

    if (!mongoose.isValidObjectId(id)) 
      return res.status(400).json({
        msg: 'Request Faild',
        code: 400
      })

    Order.findByIdAndUpdate(id, {
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
  }

  // DELETE ORDER
  async delete (req, res) {
    const id = req.params.id

    if (!mongoose.isValidObjectId(id)) 
      return res.status(400).json({
        msg: 'Request Faild',
        code: 400
      })

    Order.findByIdAndDelete(id)
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
  }
}

module.exports = new orderController()