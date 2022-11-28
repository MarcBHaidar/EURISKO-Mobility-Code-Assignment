const express = require('express');

const {body} = require('express-validator');

const categoriesController = require('../controllers/categories');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// GET /categories/allCategories /getting existing categories                         
router.get('/allCategories', isAuth, categoriesController.getCategories);

// POST /categories/newCategorie  //creating a new category             
router.post(
    '/newCategorie',
    isAuth,
     [
        body('title')
            .trim()
            .isLength({min: 5}),
    ],
    categoriesController.createCategorie
);

// GET /categories/categorie + categorieId/ fetching a single categorie                 
router.get('/categorie/:categorieId',isAuth, categoriesController.getCategorie);

// PUT /categories/categorie +this.state.editCategorie._id // updating a categorie      
router.put('/categorie/:categorieId',isAuth, [
    body('title')
        .trim()
        .isLength({min: 5}),
], categoriesController.updateCategorie);

// // DELETE /categories/categorie/ +categorieId // Deleting a single note             
router.delete('/categorie/:categorieId', isAuth, categoriesController.deleteCategorie);

module.exports = router;