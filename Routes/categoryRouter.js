const { Router } = require('express');
const categoryRouter = Router();
const categoryController = require('../controllers/categoryController');

categoryRouter.get('/add', categoryController.getCreateCategory);
categoryRouter.post('/add', categoryController.postCreateCategory);
categoryRouter.get('/delete/:id', categoryController.getDeleteCategory);
categoryRouter.post('/delete/:id', categoryController.postDeleteCategory);
module.exports = categoryRouter;
