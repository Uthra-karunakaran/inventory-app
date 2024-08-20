const pool = require('../pool');

async function getAllCategories() {
  const { rows } = await pool.query('SELECT * FROM categories ORDER BY name');
  return rows;
}

async function createCategory(name) {
  await pool.query('INSERT INTO categories (name) VALUES ($1);', [name]);
}

async function deleteCategory(id) {
  await pool.query('DELETE FROM categories WHERE id=($1)', [id]);
}

async function addItem(itemObj) {
  const { name, categoryName, price, stock, description, imgurl } = itemObj;
  //await pool.query("INSERT INTO items (name, category_id, price, stock, description, imgurl) VALUES ()")
  const query = `
            INSERT INTO items (name, category_id, price, stock, description, imgurl)
            VALUES ($1, (SELECT id FROM categories WHERE name = $2), $3, $4, $5, $6)
            RETURNING *;
        `;

  // Array of values corresponding to the placeholders
  const values = [name, categoryName, price, stock, description, imgurl];
  await pool.query(query, values);
}

async function getItem(id) {
  const { rows } = await pool.query(
    'SELECT items.id, items.name,items.price,items.stock,items.description,items.imgurl,categories.name AS category_name FROM items JOIN categories ON items.category_id=categories.id WHERE items.id=($1);',
    [id]
  );
  return rows[0];
}

async function getItemsByCategory(cat_id) {
  const { rows } = await pool.query(
    'SELECT items.id,items.name,items.price,items.stock , items.description,items.imgurl,categories.name AS category_name FROM items JOIN categories ON items.category_id=categories.id WHERE items.category_id=($1) ORDER BY items.name;',
    [cat_id]
  );
  return rows;
}

async function updateItem(item_obj) {
  const { name, category_name, price, stock, description, imgurl, id } =
    item_obj;
  await pool.query(
    'UPDATE items SET name = $1, category_id =(SELECT id FROM categories WHERE name=$2), price = $3, stock = $4, description = $5, imgurl = $6 WHERE id = $7',
    [name, category_name, price, stock, description, imgurl, id]
  );
}

async function deleteItem(id) {
  await pool.query('DELETE FROM items WHERE id=$1', [id]);
}

async function getAuth() {
  let { rows } = await pool.query('SELECT * FROM authTable;');
  return rows[0];
}

async function getAllItems() {
  const { rows } = await pool.query(
    'SELECT id,name,imgurl,price FROM items ORDER BY name'
  );
  return rows;
}

async function getCategoryName(id) {
  const { rows } = await pool.query('SELECT * FROM categories WHERE id=($1);', [
    id,
  ]);
  return rows[0];
}

async function getCategories() {
  const { rows } = await pool.query(
    'SELECT categories.name FROM categories ORDER BY name;'
  );
  return rows;
}

module.exports = {
  getAllCategories,
  createCategory,
  deleteCategory,
  addItem,
  getItem,
  getItemsByCategory,
  updateItem,
  deleteItem,
  getAuth,
  getAllItems,
  getCategoryName,
  getCategories,
};
