#! /usr/bin/env node
require('dotenv').config();
const { Client } = require('pg');

const SQL = `
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(150) NOT NULL
);

INSERT INTO categories (name) 
VALUES
  ('vegies'),
  ('fruits'),
  ('meat'),
  ('stationery'),
  ('toiletries');

CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(150) NOT NULL,
    category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    price NUMERIC(10,2),
    stock INTEGER,
    description TEXT,
    imgurl TEXT
);

INSERT INTO items (name, category_id, price, stock, description, imgurl) VALUES
('Apple', (SELECT id FROM categories WHERE name = 'fruits'), 0.99, 100, 'A juicy red apple', 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'),
('Banana', (SELECT id FROM categories WHERE name = 'fruits'), 0.59, 150, 'A bunch of ripe bananas', 'https://images.pexels.com/photos/1093038/pexels-photo-1093038.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1');


INSERT INTO items (name, category_id, price, stock, description, imgurl) VALUES
('Carrot', (SELECT id FROM categories WHERE name = 'vegies'), 0.79, 200, 'Fresh orange carrots', 'https://images.pexels.com/photos/73640/pexels-photo-73640.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'),
('Broccoli', (SELECT id FROM categories WHERE name = 'vegies'), 1.29, 80, 'Green and healthy broccoli', 'https://images.pexels.com/photos/47347/broccoli-vegetable-food-healthy-47347.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1');


INSERT INTO items (name, category_id, price, stock, description, imgurl) VALUES
('Chicken Breast', (SELECT id FROM categories WHERE name = 'meat'), 5.99, 50, 'Boneless chicken breast', 'https://images.pexels.com/photos/6107726/pexels-photo-6107726.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'),
('Salmon', (SELECT id FROM categories WHERE name = 'meat'), 6.49, 60, 'healthy salmon fish', 'https://images.pexels.com/photos/6149078/pexels-photo-6149078.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1');

INSERT INTO items (name, category_id, price, stock, description, imgurl) VALUES
('Notebook', (SELECT id FROM categories WHERE name = 'stationery'), 2.49, 120, 'A spiral-bound notebook', 'https://images.unsplash.com/photo-1612367980327-7454a7276aa7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),
('Pen', (SELECT id FROM categories WHERE name = 'stationery'), 0.99, 300, 'Blue ballpoint pen', 'https://images.unsplash.com/photo-1509824189536-24ab5d1ecb00?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),
('Highlighter', (SELECT id FROM categories WHERE name = 'stationery'), 1.29, 200,'Fluorescent yellow highlighter',  'https://images.unsplash.com/photo-1586764635350-4f88a6a30a52?q=80&w=1858&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');

INSERT INTO items (name, category_id, price, stock, description, imgurl) VALUES
('Toothpaste', (SELECT id FROM categories WHERE name = 'toiletries'), 3.99, 150, 'Mint-flavored toothpaste', 'https://images.unsplash.com/photo-1602193815349-525071f27564?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),
('Shampoo', (SELECT id FROM categories WHERE name = 'toiletries'), 5.49, 80, 'Herbal essence shampoo', 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),
('Soap', (SELECT id FROM categories WHERE name = 'toiletries'), 1.99, 200,'Lavender-scented soap bar', 'https://images.unsplash.com/photo-1542038374755-a93543c5178f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');

CREATE TABLE IF NOT EXISTS authTable (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    admin VARCHAR(150) NOT NULL
);

INSERT INTO authTable (admin) VALUES ('iamtheadmin@123');
`;

async function main() {
  console.log('seeding...');
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log('done');
}

main();
