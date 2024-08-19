const express = require('express');
const app = express();
require('dotenv').config();
const path = require('path');
const indexRouter = require('./Routes/indexRouter');
const categoryRouter = require('./Routes/categoryRouter');
const itemsRouter = require('./Routes/itemsRouter');

app.use(express.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));

const port = process.env.PORT || 3000;

app.use('/category', categoryRouter);
app.use('/items', itemsRouter);
app.use('/', indexRouter);

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).send('Something went wrong!');
});

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
