const express = require('express');
const routes = require('./routes/index');
const bodyParser = require('body-parser');
var path = require("path");

const app = express();
app.engine('pug', require('pug').__express)

app.use(express.static('public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', routes);

module.exports = app;