const express= require('express');
 const app= express(); 
 const port=5000;
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
app.use(express.static('public'));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', require('./routes/url'));
app.listen(process.env.PORT || 5000);
