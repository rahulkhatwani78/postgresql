const { pool } = require("../config/connection.js");

async function createCustomersTable() {
  const query = `
        CREATE TABLE IF NOT EXISTS customers (
            cust_id SERIAL PRIMARY KEY,
            cust_name VARCHAR(255) NOT NULL,
            cust_age INT,
            cust_email VARCHAR(255) UNIQUE NOT NULL,
            cust_city VARCHAR(255),
            created_at TIMESTAMP DEFAULT NOW()
        );
    `;
  try {
    await pool.query(query);
    console.log("Customers table created successfully");

    const checkDataQuery = `SELECT COUNT(*) FROM customers;`;
    const res = await pool.query(checkDataQuery);

    if (parseInt(res.rows[0].count) === 0) {
      const insertDummyDataQuery = `
          INSERT INTO customers (cust_name, cust_age, cust_email, cust_city) VALUES
          ('John Doe', 30, 'john.doe@example.com', 'New York'),
          ('Jane Smith', 25, 'jane.smith@example.com', 'Los Angeles'),
          ('Alice Johnson', 28, 'alice.johnson@example.com', 'Chicago'),
          ('Bob Brown', 35, 'bob.brown@example.com', 'Houston'),
          ('Charlie Davis', 40, 'charlie.davis@example.com', 'Phoenix')
      `;
      await pool.query(insertDummyDataQuery);
      console.log("Dummy data inserted successfully");
    } else {
      console.log("Dummy data already exists");
    }
  } catch (error) {
    console.error("Error initializing customers table:", error);
  }
}

module.exports = createCustomersTable;
