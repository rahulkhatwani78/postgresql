const express = require("express");
const dotenv = require("dotenv");
const userRouter = require("./routes/user.route");
const { logRequest, errorHandler } = require("./middlewares");
const createCustomersTable = require("./data/createCustomersTable");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

createCustomersTable();

// Middlewares
app.use(express.json());
app.use(logRequest("logs.txt"));

// Routes
app.use("/api/user", userRouter);

// Error Handling Middleware
app.use(errorHandler);

// Start Server
app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
