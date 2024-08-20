const asyncHandler = require('express-async-handler');

const db = require('../db/queries');
const { fetchImage } = require('./itemsController');

exports.displayAllCategories = asyncHandler(async (req, res) => {
  // getAllCategories for sidebar
  const categories = await db.getAllCategories();
  // getAllItems for the main content
  const items = await db.getAllItems();

  res.render('layout.ejs', {
    title: 'Home',
    categories: categories,
    body: 'displayAllCategory',
    items: items,
  });
});
