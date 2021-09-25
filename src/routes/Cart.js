const router = require('express').Router(),
Cart = require('../http/controller/Cart'),
{ Auth, authentication, Admin } = require('../http/middleware/VerifyToken')

// GET ALL CART
router.get('/', [Auth, Admin], Cart.getAll)

// GET ONE CART
router.get('/:id', [Auth, authentication], Cart.getById)

// CREATE CART
router.post('/', [Auth], Cart.create)

// UPDATE CART
router.put('/:id', [Auth, authentication], Cart.update)

// DELETE CART
router.delete('/:id', [Auth, authentication], Cart.delete)

module.exports = router