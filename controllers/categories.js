const {validationResult} = require('express-validator');
const note = require('../models/note');

const Note = require('../models/note');
const User = require('../models/user');
const Categories = require('../models/categories');

exports.getCategories = (req, res, next) => {
  //setting Pagination
  const currentPage = req.query.page || 1;
  const perPage = 2;
  let totalCategories;
  Categories.find()
    .countDocuments()
    .then(count => {
      totalCategories = count;
      return Categories.find()
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })// end of pagination 
  .then(Categories => {
    res
    .status(200)
    .json({message: 'All categories fetched successfully', Categories: Categories, totalCategories: totalCategories });
  })
  .catch(err => {
    if(!err.statusCode){
      err.statusCode = 500;
    }
    next(err);
  });
};

exports.createCategorie = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect');
    error.statusCode = 422;
    throw error;
  }
  const title = req.body.title;
  const creator = req.userId;

  const categorie = new Categories({
    title: title,
    creator: creator
  });
  return categorie.save()
  .then(result => {
    return User.findById(req.userId);
  })
  .then(user => {
    user.categories.push(categorie);
    return user.save();
  })
  .then(result => {
    res.status(201).json({
      message: 'Categorie created successfully!',
      post: categorie,
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

exports.getCategorie = (req, res, next) => {
  const categorieId = req.params.categorieId;
  Categories.findById(categorieId)
  .then(Categories => {
    if(!Categories) {
      const error = new Error('Could not find Categorie.');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({message: 'Categorie fetched', Categories: Categories});
  })
  .catch(err => {
    if(!err.statusCode){
      err.statusCode = 500;
    }
    next(err);
  })
}

exports.updateCategorie = (req, res, next) => {
  const categorieId = req.params.categorieId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect');
    error.statusCode = 422;
    throw error;
  }
  const title = req.body.title;
  const creator = req.userId;

  Categories.findById(categorieId)
  .then(Categories => {
    if(!Categories) {
      const error = new Error('Could not find Categorie.');
      error.statusCode = 404;
      throw error;
    }
    if(Categories.creator.toString() !== req.userId) {
      const error = new Error('Not authorised!');
      error.statusCode = 403;
      throw error;
    }
    Categories.title = title;
    Categories.creator = creator;
    return Categories.save();
  })
  .then(result => {
    res.status(200).json({message: 'Categorie updated!', Categories: result});
  })
  .catch(err => {
    if(!err.statusCode){
      err.statusCode = 500;
    }
    next(err);
  })
};

exports.deleteCategorie = (req, res, next) => {
  let categorieName;
  const categorieId = req.params.categorieId;
  Categories.findById(categorieId)
  .then(categorie => {
    categorieName = categorie.title;
    if(!categorie) {
      const error = new Error('Could not find Note.');
      error.statusCode = 404;
      throw error;
    }
    if(categorie.creator.toString() !== req.userId.toString()) {
      const error = new Error('Not authorised!');
      error.statusCode = 403;
      throw error;
    }
    return Categories.findByIdAndRemove(categorieId);
  })
  .then(result => {
    return Note.deleteMany({
      category: categorieName,
      creator: req.userId
    })
  })
  .then(result => {
    res.status(200).json({message: 'Categorie DELETED.'});
  })
  .catch(err => {
    if(!err.statusCode){
      err.statusCode = 500;
    }
    next(err);
  })
}
