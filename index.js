const express = require('express');
const app = express();
require("dotenv").config();
const morgan= require ('morgan')
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Product = require("./models/products.models");
const Category = require("./models/categories.models");
const User= require("./models/users.models")
const productRouter = require('./routes/poducts.routes');
const categoryRoutes = require('./routes/categories.routes');
const authRoutes= require('./routes/auth.routes')
const Carts = require('./models/cart.models');
const Orders = require('./models/orders.models');
const cartRoutes = require('./routes/cart.routes');
const orderRoutes = require('./routes/orders.routes');
const cookieParser = require('cookie-parser');


const api = process.env.API_URL;



app.use(bodyParser.json());
app.use(cookieParser());
app.use(morgan('tiny'));
app.use(`${api}/products`, productRouter);
app.use(`${api}/categories`, categoryRoutes);
app.use(`${api}/auth`, authRoutes);
app.use(`${api}/cart`, cartRoutes);
app.use(`${api}/orders`, orderRoutes);

mongoose.connect(process.env.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
dbName: "ecommerce",})
  .then(() => {
    console.log("Database connection is ready...");})
  .catch((err) => {
    console.log(err);
  });


app.listen(3000, () => {
  console.log("started on port 3000");
  console.log(`API URL: ${api}`);
});
