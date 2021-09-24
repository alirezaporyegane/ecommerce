const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const Api = require('./routes/Api');
require('dotenv').config()

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
      
app.use(cors());
app.use(express.json())
app.use('/api', Api)


const port = process.env.port || 5000;
app.listen(port, (err) => {
  if (err) console.log(err)
  else console.log(`app listen to port ${port}`)
});