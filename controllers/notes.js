const {validationResult} = require('express-validator');
const mongoose = require('mongoose');

const Note = require('../models/note');
const User = require('../models/user');

exports.getNotes = (req, res, next) => {
  //setting Pagination
  const currentPage = req.query.page || 1;
  const perPage = 2;
  let totalNotes;
  Note.find()
    .countDocuments()
    .then(count => {
      totalNotes = count;
      return Note.find()
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })// end of pagination 
  .then(posts => {
    res
    .status(200)
    .json({message: 'All notes are fetched successfully', posts: posts, totalNotes: totalNotes });
  })
  .catch(err => {
    if(!err.statusCode){
      err.statusCode = 500;
    }
    next(err);
  });
};

exports.createNotes = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect');
    error.statusCode = 422;
    throw error;
  }
  const title = req.body.title;
  const content = req.body.content;
  const category = req.body.category;
  const tags = req.body.tags;
  const creator = req.userId;
  const note = new Note({
    title: title,
    content: content,
    category: category,
    tags: tags,
    creator: creator
  });
  return note.save()
  .then(result => {
    return User.findById(req.userId);
  })
  .then(user => {
    return user.save();
  })
  .then(result => {
    res.status(201).json({
      message: 'Post created successfully!',
      post: note,
      creator: { _id: creator._id, name : creator.name }
  });
})
  .catch(err => {
    if(!err.statusCode){
      err.statusCode = 500;
    }
    next(err);
  });
};

exports.getNote = (req, res, next) => {
  const postId = req.params.postId;
  Note.findById(postId)
  .then(post => {
    if(!post) {
      const error = new Error('Could not find Note.');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({message: 'Note fetched by ID', post: post});
  })
  .catch(err => {
    if(!err.statusCode){
      err.statusCode = 500;
    }
    next(err);
  })
}

exports.updateNote = (req, res, next) => {
  const postId = req.params.postId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect');
    error.statusCode = 422;
    throw error;
  }
  const title = req.body.title;
  const category = req.body.category;
  const content = req.body.content;
  const tags = req.body.tags;
  const creator = req.userId;

  Note.findById(postId)
  .then(post => {
    if(!post) {
      const error = new Error('Could not find Note.');
      error.statusCode = 404;
      throw error;
    }
    if(post.creator.toString() !== req.userId) {
      const error = new Error('Not authorised!');
      error.statusCode = 403;
      throw error;
    }
    post.title = title;
    post.category = category;
    post.content = content;
    post.tags = tags;
    post.creator = creator;
    return post.save();
  })
  .then(result => {
    res.status(200).json({message: 'Note updated!', post: result});
  })
  .catch(err => {
    if(!err.statusCode){
      err.statusCode = 500;
    }
    next(err);
  })
};

exports.deleteNote = (req, res, next) => {
  const postId = req.params.postId;
  Note.findById(postId)
  .then(post => {
    if(!post) {
      const error = new Error('Could not find Note.');
      error.statusCode = 404;
      throw error;
    }
    if(post.creator.toString() !== req.userId) {
      const error = new Error('Not authorised!');
      error.statusCode = 403;
      throw error;
    }
    return Note.findByIdAndRemove(postId);
  })
  .then(result => {
    res.status(200).json({message: 'NOTE DELETED.'});
  })
  .catch(err => {
    if(!err.statusCode){
      err.statusCode = 500;
    }
    next(err);
  })
}
