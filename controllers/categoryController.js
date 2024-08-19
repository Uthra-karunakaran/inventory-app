const db = require('../db/queries');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

const validateName = [
  body('name')
    .trim()
    .matches(/^[A-Za-z\s]+$/)
    .withMessage(`Category name must only contain letters and spaces.`)
    .isLength({ min: 1, max: 150 })
    .withMessage(`Category name must be between 1 and 150 characters.`),
];
exports.getCreateCategory = asyncHandler(async (req, res) => {
  let categories = await db.getAllCategories();
  res.render('layout.ejs', {
    title: 'Add category',
    categories: categories,
    body: 'addCategory',
    formData: {},
  });
});

exports.postCreateCategory = [
  validateName,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    let categories = await db.getAllCategories();
    if (!errors.isEmpty()) {
      return res.render('layout.ejs', {
        title: 'Add category',
        errors: errors.array(),
        categories: categories,
        body: 'addCategory',
        formData: req.body,
      });
    }
    const name = req.body.name;
    await db.createCategory(name);
    res.redirect('/');
  }),
];

exports.getDeleteCategory = asyncHandler(async (req, res) => {
  const id = req.params.id;
  let categories = await db.getAllCategories();
  res.render('layout.ejs', {
    title: 'Delete Item',
    categories: categories,
    body: 'categoryAuth',
    formData: { id: id },
  });
});

exports.postDeleteCategory = asyncHandler(async (req, res) => {
  let categories = await db.getAllCategories();
  const auth = await db.getAuth();
  let id = req.params.id;
  let ipauth = req.body.auth;
  if (auth['admin'] == ipauth) {
    await db.deleteCategory(id);
    res.redirect('/');
  } else {
    let formData = req.body;
    formData['id'] = id;

    res.render('layout.ejs', {
      title: 'Delete Item',
      errors: [{ msg: 'Admin Password does not match' }],
      categories: categories,
      body: 'categoryAuth',
      formData: formData,
    });
  }
});
