const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const notesRoutes = require('./routes/notes');
const authRoutes = require('./routes/auth');
const categoriesRoutes = require('./routes/categories');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/notes', notesRoutes);
app.use('/auth', authRoutes);
app.use('/categories', categoriesRoutes);

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({message: message, data: data});
})

mongoose
    .connect('mongodb+srv://MarcBouHaidar:MARC1199@cluster0.6ccesw7.mongodb.net/notes')
        .then(result => {
            console.log('Database Connected!');
            app.listen(8080);
        })
        .catch(err => console.log(err));