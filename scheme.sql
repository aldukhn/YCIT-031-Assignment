-- Drop the existing tables if they exist
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS products;

-- Table: products
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL
);

/*
The "products" table stores information about the products available in the online store.
- id: Primary key for the product.
- name: The name of the product.
- price: The price of the product.
*/

-- Table: users
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL
);

/*
The "users" table stores information about the users of the online store.
- id: Primary key for the user.
- username: Unique username for the user.
- password: The password of the user (Note: It is recommended to store hashed passwords in practice).
- role: The role of the user (e.g., admin, customer, etc.).
*/

-- Table: transactions
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

/*
The "transactions" table stores information about the transactions made in the online store.
- id: Primary key for the transaction.
- user_id: Foreign key referencing the id of the user who made the transaction.
- product_id: Foreign key referencing the id of the product involved in the transaction.
- quantity: The quantity of the product purchased.
- total_price: The total price of the transaction.
- transaction_date: The date and time of the transaction (defaults to the current timestamp).
*/
