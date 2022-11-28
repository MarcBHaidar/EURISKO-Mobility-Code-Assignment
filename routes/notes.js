const express = require('express');

const {body} = require('express-validator');

const notesController = require('../controllers/notes');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// GET /notes/posts/getting existing notes  
router.get('/posts', isAuth, notesController.getNotes);

// POST /notes/post//creating a new note         
router.post(
    '/post',
    isAuth,
     [
        body('title')
            .trim()
            .isLength({min: 5}),
        body('category')
            .trim()
            .isLength({min: 3}),
        body('content')
            .trim()
            .isLength({min: 5})
    ],
    notesController.createNotes
);

// GET /notes/post + postId/ fetching a single note         
router.get('/post/:postId',isAuth, notesController.getNote);

// PUT /notes/post +this.state.editPost._id // updating a note 
router.put('/post/:postId',isAuth, [
    body('title')
        .trim()
        .isLength({min: 5}),
    body('category')
        .trim()
        .isLength({min: 3}),
    body('content')
        .trim()
        .isLength({min: 5})
], notesController.updateNote);

// DELETE /notes/post/ +postId // Deleting a single post       
router.delete('/post/:postId', isAuth, notesController.deleteNote);

module.exports = router;