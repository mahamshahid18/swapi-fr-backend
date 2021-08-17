'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const FilmController = require('./films');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded( { extended: true }));
app.use(cors());


app.listen(3000, () => {
    console.log('server started on port 3000');
});


app.use('/films', FilmController);