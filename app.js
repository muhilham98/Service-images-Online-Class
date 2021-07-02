require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

//import mongoose
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/images_database', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});

const indexRouter = require('./routes/index');
const imagesRouter = require('./routes/images');

const app = express();

app.use(logger('dev'));
app.use(express.json({ limit: '50mb'}));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/images', imagesRouter);

module.exports = app;
