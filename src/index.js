const express = require('express');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config()


class App {
  constructor () {
    this.setupMongoDb()
    this.setupMiddleware()
    this.setupRoutes()
    this.setupPort()
  }

  setupMongoDb () {
    mongoose.connect("mongodb://127.0.0.1:27017/eCommers",{
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
      .then(() => {
        console.log("mongodb Is Connected");
      })
      .catch(err => {
        console.log("db not connected", err);
      })
  }

  setupPort () {
    const port = process.env.port || 5000;
    app.listen(port, (err) => {
      if (err) console.log(err);
      else console.log(`app listen to port ${port}`)
    });
  }

  setupMiddleware () {
    const cors = require('cors');

    app.use(cors());
    app.use(express.json());
  }

  setupRoutes () {
    const Api = require('./src/routes/Api');

    app.use('/api', Api);
  }
}

module.exports = App