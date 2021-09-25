const router = require('express').Router(),
Order = require('../http/controller/Order'),
{ Auth, authentication, Admin } = require('../http/middleware/VerifyToken')

// GET ALL ORDERS
router.get('/', [Auth, Admin], Order.getAll)

// GET COUNT
router.get('/', [Auth, Admin], Order.getCount)

// GET ORDERS STATUS
router.get('/order/status', [Auth, Admin], Order.getStatus)

// GET ONE ORDERS
router.get('/:id', [Auth, authentication], Order.getById)

// CREATE ORDERS
router.post('/', [Auth], Order.create)

// UPDATE ORDERS
router.put('/:id', [Auth, authentication], Order.update)

// DELETE ORDERS
router.delete('/:id', [Auth, authentication], Order.delete)


module.exports = router