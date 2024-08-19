const { Router } = require('express');
const indexRouter = Router();
const indexController = require('../controllers/indexController');

indexRouter.get('/', indexController.displayAllCategories);

module.exports = indexRouter;
