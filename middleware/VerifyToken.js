const jwt = require('jsonwebtoken');

const Auth = (req, res, next) => {
  const authHeaders = req.Headers.token
  if (authHeaders) {
    jwt.verify(authHeaders, process.env.TOKEN_SEC, (err, user) => {
      if (err) return res.status(401).json({
        msg: 'token is not valid',
        error: err,
        code: 401
      })

      req.user = user
      next()
    })
  } else {
    return res.status(401).json({
      msg: 'you Are not authentication',
      code: 401
    })
  }
}

const authentication = (req, res, next) => {
  Auth(req, res, () => {
    if (req.body.id = req.params.id || req.user.isAdmin) {
      next()
    } else {
      res.status(403).json({
        msg: 'you are not allow to that!',
        code: 403
      })
    }
  })
}

const Admin = (req, res, next) => {
  Auth(req, res, () => {
    if (req.user.isAdmin) {
      next()
    } else {
      res.status(403).json({
        msg: 'you are not allow to that!',
        code: 403
      })
    }
  })
}

module.exports = { Auth, authentication, Admin }