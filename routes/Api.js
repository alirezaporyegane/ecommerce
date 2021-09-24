const app = require('express')();
const Auth = require('./auth');
const Cart = require('./Cart');
const Order = require('./Order');
const Products = require('./Products');
const User = require('./user');

//ROUTES
app.use('/auth', Auth);
app.use('/cart', Cart);
app.use('/order', Order);
app.use('/products', Products);
app.use('/user', User);

module.exports = app

