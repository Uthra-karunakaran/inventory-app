const { Router } = require('express');
const itemsRouter = Router();
const itemsController = require('../controllers/itemsController');

// to add new items
itemsRouter.get('/add', itemsController.getCreateItem);
itemsRouter.post('/add', itemsController.postCreateItem);

// to get all the items under the specific category
// in the controller use req.query.id
// the path will look like this /items/category?id=2
itemsRouter.get('/category', itemsController.getItemsByCategory);

//to update a specific item
// req.params.id
itemsRouter.get('/update/:id', itemsController.getUpdateItem);
itemsRouter.post('/update/:id', itemsController.postUpdateItem);

// to delete a specific item
itemsRouter.get('/delete/:id', itemsController.getDeleteItem);
itemsRouter.post('/delete/:id', itemsController.postDeleteItem);

// to get a specific item , using route params
// req.params.id
itemsRouter.get('/:id', itemsController.getDisplayItem);

module.exports = itemsRouter;
