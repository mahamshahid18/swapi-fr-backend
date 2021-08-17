'use strict';

const express = require('express');
const axios = require('axios');
const mysql = require('mysql2');
const router = express.Router();

const config = require('./dbConfig');

const BASE_URL = 'https://swapi.dev/api';

const pool = mysql.createPool(config);


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
    }
});

router.get('/:id/characters', async (req, res, next) => {
    const filmId = req?.params?.id;
    const url = `${BASE_URL}/films/${filmId}`;
    // generate random image
    const imgUrl = 'https://picsum.photos/100';

    try {
        const response = await axios.get(url);
        
        if (response?.data) {
            const { data: { characters } } = response;
            const charactersResponse = [];
            
            for (let count = 0; count < characters?.length; count++) {
                const getCharacterUrl = characters[count];
                
                try {
                    const getCharacterResponse = await axios.get(getCharacterUrl);
                    const resolvedImgUrl = await axios.get(imgUrl);
                    
                    if (getCharacterResponse?.data) {
                        const { data } = getCharacterResponse;
                        const getCharacterResponseWithImage = {
                            ...data,
                            imageUrl: resolvedImgUrl?.request?.res?.responseUrl
                        };

                        charactersResponse.push(getCharacterResponseWithImage);
                    }
                } catch (err) {
                    console.log(err);
                }
            }

            if (charactersResponse?.length) {
                res.status(200);
                res.json(charactersResponse);
            } else {
                res.status(404).send();
            }

        }
    } catch (err) {
        console.log(err);
    }
});

router.get('/favorites', async (req, res, next) => {
    const selectQuery = 'SELECT * FROM FAVORITES';
    pool.getConnection((err, connection) => {
        if (err) throw err;

        connection.query(selectQuery, (error, dbResponse) => {
            if (error) throw error;

            res.status(200);
            res.json(dbResponse);
        });

        connection.release();
    });
});

router.post('/:id/favorite', async (req, res, next) => {
    const filmId = req?.params?.id;
    const insertQuery = 'INSERT INTO FAVORITES VALUES (?, ?);'
    const values = ['NULL', filmId];

    pool.getConnection((err, connection) => {
        if (err) throw err;

        connection.query(insertQuery, values, () => {
            res.status(201).send();
        });
        connection.release();
    });
});

module.exports = router;