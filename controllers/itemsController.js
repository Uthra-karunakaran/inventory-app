const asynchandler = require('express-async-handler');
const db = require('../db/queries');
const { body, validationResult } = require('express-validator');
const { URL } = require('url');
const { name } = require('ejs');

const validateItemData = [
  body('name')
    .trim()
    .matches(/^[A-Za-z\s]+$/)
    .withMessage(`Item name must only contain letters and spaces.`)
    .isLength({ min: 1, max: 150 })
    .withMessage(`Item name must be between 1 and 150 characters.`),
  body('price')
    .trim()
    .isFloat({ min: 0.01 })
    .withMessage('Price must be a positive number greater than 0.01 .'),
  body('stock')
    .isInt({ min: 10 })
    .withMessage('Stock must be an greater than 10'),

  body('imgurl')
    .trim()
    .custom((value, { req }) => {
      try {
        // Allow the default image URL to pass validation
        if (value === '/default_img.jpg') {
          return true; // Validation passes
        }

        // Attempt to parse the URL
        const parsedUrl = new URL(value);

        // Reformat the URL to correct common issues (e.g., re-encoding)
        const formattedUrl = parsedUrl.toString();

        // If the formatted URL differs from the original, silently correct it
        if (formattedUrl !== value) {
          req.body.imgurl = formattedUrl; // Update the request body with the corrected URL
        }

        return true; // Validation passes
      } catch (err) {
        // If the URL cannot be parsed or reformatted, throw an error
        throw new Error('Invalid URL. Please provide a valid URL.');
      }
    }),
];

exports.getCreateItem = asynchandler(async (req, res) => {
  let categories = await db.getAllCategories();
  const cat_names = await db.getCategories();
  let formData = {};
  formData['cat_names'] = cat_names;
  res.render('layout.ejs', {
    title: 'Add Item',
    categories: categories,
    body: 'addItem',
    formData: formData,
  });
});

exports.postCreateItem = [
  validateItemData,
  asynchandler(async (req, res) => {
    let categories = await db.getAllCategories();
    const errors = validationResult(req);
    const cat_names = await db.getCategories();
    if (!errors.isEmpty()) {
      let formData = req.body;
      formData['cat_names'] = cat_names;
      return res.render('layout.ejs', {
        title: 'Add Item',
        errors: errors.array(),
        categories: categories,
        body: 'addItem',
        formData: formData,
      });
    }

    // making req to dd
    const Checkimgurl = async (req) => {
      const imgStatus = await fetchImage(req.body['imgurl']);
      console.log(imgStatus);
      if (!imgStatus) {
        // No image fetched, set to default image
        req.body['imgurl'] = '/default_img.jpg';
      }
    };

    // Call the function with `req`
    await Checkimgurl(req);
    console.log(req.body);
    console.log('postCreateItem');
    await db.addItem(req.body);
    res.redirect('/');
  }),
];

exports.getDisplayItem = asynchandler(async (req, res) => {
  const id = req.params.id;
  if (isNaN(id)) {
    return res.status(400).send('Invalid category ID');
  }
  let data = await db.getItem(id);

  let categories = await db.getAllCategories();

  res.render('layout.ejs', {
    title: 'Display Item',
    categories: categories,
    body: 'displayItem',
    data: data,
  });
});

exports.getItemsByCategory = asynchandler(async (req, res) => {
  let cat_id = req.query.id;
  cat_id = parseInt(cat_id, 10);
  if (isNaN(cat_id)) {
    return res.status(400).send('Invalid category ID');
  }
  let rows;
  if (cat_id) {
    rows = await db.getItemsByCategory(cat_id);
  }
  let categories = await db.getAllCategories();
  let category_name = await db.getCategoryName(cat_id);
  let items = rows;

  items['category_name'] = category_name['name'];
  items['category_id'] = category_name['id'];

  res.render('layout.ejs', {
    title: `Items in ${category_name['name']}`,
    categories: categories,
    body: 'displayItemsByCategory',
    items: items,
  });
});

exports.getUpdateItem = asynchandler(async (req, res) => {
  const item_id = req.params.id;
  if (isNaN(item_id)) {
    return res.status(400).send('Invalid category ID');
  }
  let rows;
  if (item_id) {
    rows = await db.getItem(item_id);
  }
  let categories = await db.getAllCategories();
  const cat_names = await db.getCategories();
  let formData = rows;
  formData['cat_names'] = cat_names;
  res.render('layout.ejs', {
    title: 'Update Item',
    categories: categories,
    body: 'updateItem',
    formData: formData,
  });
});

exports.postUpdateItem = [
  validateItemData,
  asynchandler(async (req, res) => {
    const errors = validationResult(req);
    let categories = await db.getAllCategories();
    const cat_names = await db.getCategories();

    if (!errors.isEmpty()) {
      req.body.id = req.params.id;

      let formData = req.body;
      formData['cat_names'] = cat_names;
      return res.render('layout.ejs', {
        title: 'Update Item',
        errors: errors.array(),
        categories: categories,
        body: 'updateItem',
        formData: formData,
      });
    }
    // if no errors
    const Checkimgurl = async () => {
      try {
        const imgStatus = await fetchImage(req.body['imgurl']);
        console.log(imgStatus);
        if (!imgStatus) {
          //no img is fetched
          req.body['imgurl'] = '/default_img.jpg';
        }
      } catch (error) {
        // Handle any unexpected errors in image fetching

        req.body['imgurl'] = '/default_img.jpg';
      }
    };
    await Checkimgurl();
    console.log(req.body);
    console.log('postUpdateItem ');
    req.body.id = req.params.id;
    await db.updateItem(req.body);

    res.redirect('/');
  }),
];

exports.getDeleteItem = asynchandler(async (req, res) => {
  // await db.deleteItem(id);
  const id = req.params.id;
  let categories = await db.getAllCategories();

  res.render('layout.ejs', {
    title: 'Delete Item',
    categories: categories,
    body: 'auth',
    formData: { id: id },
  });
});

exports.postDeleteItem = asynchandler(async (req, res) => {
  let categories = await db.getAllCategories();
  const auth = await db.getAuth();
  let id = req.params.id;
  let ipauth = req.body.auth;
  if (auth['admin'] == ipauth) {
    await db.deleteItem(id);
    res.redirect('/');
  } else {
    let formData = req.body;
    formData['id'] = id;

    res.render('layout.ejs', {
      title: 'Delete Item',
      errors: [{ msg: 'Admin Password does not match' }],
      categories: categories,
      body: 'auth',
      formData: formData,
    });
  }
});

const fetchImage = async (url) => {
  try {
    const response = await fetch(url);

    // Check if the response is OK and the content type is an image
    if (
      !response.ok ||
      !response.headers.get('content-type').includes('image')
    ) {
      throw new Error(
        `Invalid response! status: ${response.status}, content-type: ${response.headers.get('content-type')}`
      );
    }

    return true;
  } catch (error) {
    // Log the error if needed
    console.error(`Failed to fetch image: ${error.message}`);
    return false;
  }
};
