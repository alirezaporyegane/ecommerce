const router = require('express').Router();
const { Auth, authentication, Admin } = require('../http/middleware/VerifyToken')
const User = require('../http/controller/User')

// GET ALL USER
router.get('/', [Auth, Admin], User.getAll)

// GET COUNT
router.get('/count', [Auth, Admin], User.getCount)

// GET ONE USER
router.get('/:id', [Auth, authentication, Admin], User.getById)

// GET USER STATUS
router.get('/user/status', [Auth, Admin], User.getStatus)

// UPDATE USER
router.put('/:id', [Auth, authentication], User.update)

// DELETE USER
router.delete('/:id', [Auth, authentication], User.delete)


module.exports = router