const Products = require('../../models/Products'),
mongoose = require('mongoose'),
_ = require('lodash');


class productsContrller {
  async getAll (req, res) {
    const qNew = req.query.new
    const qCategories = req.query.categories
    
    try {
      let products;

      if (qNew) {
        products = await Products.find().sort({ createdAt: -1 }).limit(5)
      } else if (qCategories) {
        products = await Products.find({ categories: {
          $in: [qCategories]
        } })
      } else {
        products = await Products.find()
      }

      res.status(200).json(products)
    } catch (err) {
      res.status(500).json({
        error: err,
        code: 500
      })
    }
  }

  async getCount (req, res) {
    Products.find().countDocuments()
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

  async getById (req, res) {
    const id = req.params.id

    if (!mongoose.isValidObjectId(id)) 
      return res.status(400).json({
        msg: 'Request Faild',
        code: 400
      })

    Products.findById(id)
      .then(result => {
        res.status(200).json(_.pick(result, ['title', 'desc', 'img', 'categories', 'size', 'color', 'price']))
      })
      .catch(err => {
        res.status(500).json({
          error: err,
          code: 500
        })
      })
  }

  async create (req, res) {
    const products = new Products(_.pick(req.body,  ['title', 'desc', 'img', 'categories', 'size', 'color', 'price' ]))
  
    products.save()
      .then(result => {
        res.status(200).json(_.pick(result, ['title', 'desc', 'img', 'categories', 'size', 'color', 'price']))
      })
      .catch(err => {
        res.status(500).json({
          error: err,
          code: 500
        })
      })
  }

  async update (req, res) {
    const id = req.params.id

    if (!mongoose.isValidObjectId(id)) 
      return res.status(400).json({
        msg: 'Request Faild',
        code: 400
      })

    products.findByIdAndUpdate(id, {
        $set: req.body
      }, { new: true })
        .then(result => {
          res.status(200).json(_.pick(result, ['title', 'desc', 'img', 'categories', 'size', 'color', 'price']))
        })
        .catch(err => {
          res.status(500).json({
            error: err,
            code: 500
          })
        })
  }

  async delete (req, res) {
    const id = req.params.id

    if (!mongoose.isValidObjectId(id)) 
      return res.status(400).json({
        msg: 'Request Faild',
        code: 400
      })

    products.findByIdAndDelete(id)
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

module.exports = new productsContrller()