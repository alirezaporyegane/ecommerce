const router = require('express').Router();
const Products = require('../http/controller/Products')
const { Auth, authentication, Admin } = require('../http/middleware/VerifyToken')


// GET ALL PRODUCTS
router.get('/', [Auth, Admin], Products.getAll)

// GET COUNT
router.get('/', [Auth, Admin], Products.getCount)

// GET ONE PRODUCTS
router.get('/:id', [Auth, authentication, Admin], Products.getById)

// CREATE PRODUCTS
router.post('/', [Auth, Admin], Products.create)

// UPDATE PRODUCTS
router.put('/:id', [Auth, authentication], Products.update)

// DELETE PRODUCTS
router.delete('/:id', [Auth, authentication], Products.delete)


module.exports = router