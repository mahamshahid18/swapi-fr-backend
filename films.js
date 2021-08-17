'use strict';

const express = require('express');
const axios = require('axios');
const router = express.Router();

const BASE_URL = 'https://swapi.dev/api';


router.get('/', async (req, res, next) => {
    const url = `${BASE_URL}/films`;

    try {
        const response = await axios.get(url);

        if (response && response.data) {
            const { data: { results } } = response;
            
            res.status(200);
            res.json(results);
        }
    } catch (err) {
        console.log(err);
        // next(err)
    }
});

module.exports = router;