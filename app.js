require("dotenv").config();
require("express-async-errors")

const express = require('express');
const app = express();
const morgan = require('morgan');
const log=require("./startup/logger")
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
const cors = require('cors');
const compression = require('compression');

const {webhookCheckout}=require("./routers/orderRoute")

// Enable other domains to access your application
app.use(cors());
app.options('*', cors());

// compress all responses
app.use(compression());
app.use(morgan('dev'));
app.use(express.urlencoded({extended:true}))
app.use(express.json());
app.use(express.static('uploads'))


  




require("./startup/db")()
app.post(
  '/webhook-checkout',
  express.raw({ type: 'application/json' }),
  webhookCheckout
);

require("./startup/routes")(app)

  



const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  log.info(`App running running on port ${PORT}`);
});
