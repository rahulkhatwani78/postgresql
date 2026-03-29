# 🐘 Week 5 Revision: PostgreSQL Complete Overview

This document serves as a comprehensive revision guide summarizing PostgreSQL concepts covered in the previous sections, from basic installation to advanced Node.js integration.

---

## 1. PostgreSQL Fundamentals & CRUD

### What is PostgreSQL?

- An open-source, powerful **RDBMS** (Relational Database Management System) that structures data into tables consisting of rows and columns.
- **Hierarchy:** Database (Highest) $\rightarrow$ Schema (Namespace, usually `public`) $\rightarrow$ Table (Actual data storage).

### Basic Commands

- `\l` or `\list` - List all databases.
- `CREATE DATABASE name;` - Create a new database.
- `\c name` - Connect to a database.
- `DROP DATABASE name;` - Delete a database.

### CRUD Operations

- **C**reate (`INSERT INTO table (cols) VALUES (vals);`)
- **R**ead (`SELECT * FROM table;`)
- **U**pdate (`UPDATE table SET col = val WHERE condition;`)
- **D**elete (`DELETE FROM table WHERE condition;`)

### Datatypes & Constraints

- **Datatypes:** `INT`, `VARCHAR`, `BOOLEAN`, `DATE`, `SERIAL` (Auto-increment).
- **Constraints:**
  - `PRIMARY KEY`: Uniquely identifies a record (`NOT NULL` + `UNIQUE`).
  - `NOT NULL`: Ensures a column cannot be empty.
  - `DEFAULT`: Sets a default value if none is provided.
  - `CHECK`: Ensures values meet a specific condition (e.g., `CHECK (salary > 0)`).

---

## 2. Refining Data, Operators & Relationships

### Filtering & Sorting

- **`WHERE`**: Filter rows based on conditions.
- **`ORDER BY`**: Sort results `ASC` or `DESC`.
- **`DISTINCT`**: Remove duplicates.
- **`LIMIT` & `OFFSET`**: Restrict output size and skip rows (useful for pagination).
- **`LIKE`**: Pattern matching (`%` for any length, `_` for single character).

### Aggregate Functions & Grouping

- **Aggregates:** `COUNT()`, `SUM()`, `AVG()`, `MIN()`, `MAX()`.
- **`GROUP BY`**: Groups rows sharing a property so aggregate functions can be applied to each group.
- **`HAVING`**: Filters grouped data (since `WHERE` cannot be used with aggregates).
- **`ROLLUP`**: Generates multiple grouping sets and calculates partial/grand totals.

### Table Modifications & Logic

- **`ALTER TABLE`**: Add, modify, rename, or drop columns.
- **`CASE`**: Conditional logic (if-then-else) in SQL queries.

### Relationships & Joins

- **Relationships:** One-to-One, One-to-Many, Many-to-Many (requires a junction table).
- **Foreign Key:** Links tables together, maintaining referential integrity.
- **Joins:**
  - `INNER JOIN`: Returns matching rows in both tables.
  - `LEFT JOIN`: Returns all rows from the left table and matched rows from the right.
  - `RIGHT JOIN`: Returns all rows from the right table and matched rows from the left.
  - `FULL JOIN`: Returns records when there is a match in either table.
- **Views:** Virtual tables based on the result-set of an SQL statement.

---

## 3. Advanced Concepts, Normalization & Indexing

### Procedures & Functions

- **Stored Procedures:** Perform actions, can manage transactions (`COMMIT`/`ROLLBACK`), called using `CALL`.
- **User Defined Functions (UDF):** Return values/tables, used in `SELECT`, cannot manage transactions.

### Window Functions & CTEs

- **Window Functions:** Perform calculations across related rows _without_ collapsing them.
  - _Aggregates:_ `SUM() OVER(PARTITION BY ...)`
  - _Ranking:_ `ROW_NUMBER()`, `RANK()`, `DENSE_RANK()`, `NTILE()`
  - _Positional:_ `LAG()`, `LEAD()`, `FIRST_VALUE()`, `NTH_VALUE()`
- **CTE (Common Table Expressions):** Temporary result sets using the `WITH` clause, making complex queries readable.

### Triggers & Transactions

- **Triggers:** Automatically execute functions on events (`INSERT`, `UPDATE`, `DELETE`).
- **Transactions (ACID):** Ensure data integrity. Use `BEGIN;`, run queries, and then `COMMIT;` (save) or `ROLLBACK;` (undo everything if an error occurs).

### Normalization & Indexing

- **Normalization:** Organizing data to reduce redundancy (1NF, 2NF, 3NF).
- **Indexing:** Lookup tables for faster data retrieval (B-Tree is default, Hash, Unique, Composite).

---

## 4. Node.js & PostgreSQL Connection Pooling

### Why Use a Connection Pool?

- Reusing existing connections instead of establishing new ones for every query improves efficiency.
- Manages concurrency and prevents hitting database connection limits.

### Implementation with `pg` package

```javascript
const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "my_database",
  password: "password",
  port: 5432,
  max: 20,
});

// Standard Querying
const res = await pool.query("SELECT * FROM users");

// Transactions (Manual Checkout)
const client = await pool.connect();
try {
  await client.query("BEGIN");
  await client.query("INSERT INTO users(name) VALUES($1)", ["Alice"]);
  await client.query("COMMIT");
} catch (e) {
  await client.query("ROLLBACK");
} finally {
  client.release(); // Crucial step!
}
```

---

## 5. Practical Task

A complete practical task demonstrating these concepts can be found here:
[Week 5 Practical Task](https://github.com/rahulkhatwani78/postgresql/tree/master/006-week5-practicalTask)
