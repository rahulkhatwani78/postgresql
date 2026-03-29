# Week 5 Practical Task - PostgreSQL CRUD API

This project is a practical implementation of a RESTful API using Node.js, Express, and PostgreSQL. It demonstrates how to perform CRUD (Create, Read, Update, Delete) operations on a PostgreSQL database containing a `customers` table.

## Features

- **Express Server**: Set up using Express.js.
- **PostgreSQL Integration**: Interacts securely with a PostgreSQL database using the `pg` package.
- **Auto-Initialization**: Automatically creates the `customers` table and inserts 5 dummy records if the table is empty upon server startup.
- **RESTful Endpoints**: Full CRUD operations on user (customer) data.
- **Middlewares**: Custom request logging to `logs.txt` and centralized error handling.

## Tech Stack

- **Node.js**
- **Express.js**: Web framework for Node.js
- **PostgreSQL**: Relational Database Management System
- **pg**: PostgreSQL client for Node.js
- **dotenv**: For loading environment variables
- **nodemon**: For auto-reloading during development

## Project Structure

```text
006-week5-practicalTask/
├── src/
│   ├── config/
│   │   └── connection.js           # PostgreSQL connection pool setup
│   ├── controllers/
│   │   └── user.controller.js      # Route handler logic for user actions
│   ├── data/
│   │   └── createCustomersTable.js # Table init script with dummy data insertion
│   ├── middlewares/
│   │   └── index.js                # Request logging and global error handler
│   ├── models/
│   │   └── user.model.js           # Database queries interaction
│   ├── routes/
│   │   └── user.route.js           # API route definitions
│   └── index.js                    # Entry point of the Express app
├── .env                            # Environment variables (DB credentials, PORT)
├── package.json                    # Project metadata & dependencies
└── README.md                       # Documentation (This File)
```

## Prerequisites

Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/)

## Environment Variables

Create a `.env` file in the root of your project and configure it with your PostgreSQL credentials:

```ini
PORT=3001
DB_USER=your_postgres_username
DB_PASSWORD=your_postgres_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_database_name
```
*(Make sure to adjust the key names based on what is used in `connection.js`)*

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the server:**
   ```bash
   npm start
   ```

3. When the server starts successfully, it will log down `Server is listening on port 3001` (or your configured port).
4. The database table `customers` will be created automatically, and initial mock records will be seeded if the table is empty.

## API Endpoints

The base URL for all endpoints is `http://localhost:<PORT>/api/user`

### 1. Get All Users
- **Method:** `GET`
- **Endpoint:** `/`
- **Description:** Retrieves all customers from the database.

### 2. Get User By ID
- **Method:** `GET`
- **Endpoint:** `/:id`
- **Description:** Retrieves a single customer by their ID.

### 3. Create a User
- **Method:** `POST`
- **Endpoint:** `/`
- **Description:** Creates a new customer.
- **Body Form-Data / JSON:**
  ```json
  {
    "cust_name": "John Doe",
    "cust_age": 30,
    "cust_email": "johndoe@example.com",
    "cust_city": "New York"
  }
  ```

### 4. Update a User
- **Method:** `PUT`
- **Endpoint:** `/:id`
- **Description:** Updates an existing customer's details by their ID.
- **Body Form-Data / JSON:** (Include at least one field to update)
  ```json
  {
    "cust_age": 31,
    "cust_city": "Los Angeles"
  }
  ```

### 5. Delete a User
- **Method:** `DELETE`
- **Endpoint:** `/:id`
- **Description:** Deletes a customer by their ID.
