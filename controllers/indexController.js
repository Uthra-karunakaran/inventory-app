const asyncHandler = require('express-async-handler');

const db = require('../db/queries');
const { fetchImage } = require('./itemsController');

exports.displayAllCategories = asyncHandler(async (req, res) => {
  // getAllCategories for sidebar
  const categories = await db.getAllCategories();
  // getAllItems for the main content
  const items = await db.getAllItems();
  await Promise.all(
    items.map(async (item) => {
      const Checkimgurl = async () => {
        try {
          const imgStatus = await fetchImage(item['imgurl']);

          if (!imgStatus) {
            //no img is fetched
            item['imgurl'] = '/default_img.jpg';
          }
        } catch (error) {
          // Handle any unexpected errors in image fetching
          item['imgurl'] = '/default_img.jpg';
        }
      };
      await Checkimgurl();
    })
  );
  res.render('layout.ejs', {
    title: 'Home',
    categories: categories,
    body: 'displayAllCategory',
    items: items,
  });
});
