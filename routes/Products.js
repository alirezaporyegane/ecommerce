const router = require('express').Router();
const { Auth, authentication, Admin } = require('../middleware/VerifyToken')
const Products = require('../modules/Products');
const _ = require('lodash');

// CREATE PRODUCTS
router.post('/', [Auth, Admin], (req, res) => {
  const products = new Products(_.pick(req.body,  ['title', 'desc', 'img', 'categories', 'size', 'color', 'price']))
  
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
})

// UPDATE PRODUCTS
router.put('/:id', [Auth, authentication], (req, res) => {
  products.findByIdAndUpdate(req.params.id, {
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
})

// DELETE PRODUCTS
router.delete('/:id', [Auth, authentication], (req, res) => {
  products.findByIdAndDelete(req.params.id)
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


// GET ONE PRODUCTS
router.get('/:id', [Auth, authentication, Admin], (req, res) => {
  Products.findById(req.params.id)
    .then(result => {
      res.status(200).json(_.pick(result, ['title', 'desc', 'img', 'categories', 'size', 'color', 'price']))
    })
    .catch(err => {
      res.status(500).json({
        error: err,
        code: 500
      })
    })
})

// GET ALL PRODUCTS
router.get('/', [Auth, Admin], async (req, res) => {
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
})


module.exports = router