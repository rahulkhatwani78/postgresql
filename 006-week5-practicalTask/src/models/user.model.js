const { pool } = require("../config/connection.js");

/**
 * Retrieves all users from the database
 */
async function getAllUsersService() {
  const users = await pool.query("SELECT * FROM customers");
  return users?.rows;
}

/**
 * Creates a new user in the database
 */
async function createUserService(userData = {}) {
  const { cust_name, cust_age, cust_email, cust_city } = userData;
  const user = await pool.query(
    "INSERT INTO customers (cust_name, cust_age, cust_email, cust_city) VALUES ($1, $2, $3, $4) RETURNING *",
    [cust_name, cust_age, cust_email, cust_city],
  );
  return user?.rows?.[0];
}

/**
 * Retrieves a single user by their ID
 */
async function getUserByIdService(id) {
  const user = await pool.query("SELECT * FROM customers WHERE cust_id = $1", [
    id,
  ]);
  return user?.rows?.[0];
}

/**
 * Updates an existing user by their ID
 */
async function updateUserByIdService(id, userData = {}) {
  const { cust_name, cust_age, cust_email, cust_city } = userData;
  let query = "UPDATE customers SET ";
  const queryParams = [];
  let paramIndex = 1;
  if (cust_name) {
    query += `cust_name = $${paramIndex++}, `;
    queryParams.push(cust_name);
  }
  if (cust_age) {
    query += `cust_age = $${paramIndex++}, `;
    queryParams.push(cust_age);
  }
  if (cust_email) {
    query += `cust_email = $${paramIndex++}, `;
    queryParams.push(cust_email);
  }
  if (cust_city) {
    query += `cust_city = $${paramIndex++}, `;
    queryParams.push(cust_city);
  }
  query = query.slice(0, -2);
  query += ` WHERE cust_id = $${paramIndex} RETURNING *`;
  queryParams.push(id);
  const user = await pool.query(query, queryParams);
  return user?.rows?.[0];
}

/**
 * Deletes a user by their ID
 */
async function deleteUserByIdService(id) {
  const user = await pool.query(
    "DELETE FROM customers WHERE cust_id = $1 RETURNING *",
    [id],
  );
  return user?.rows?.[0];
}

module.exports = {
  getAllUsersService,
  createUserService,
  getUserByIdService,
  updateUserByIdService,
  deleteUserByIdService,
};
