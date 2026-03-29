const {
  getAllUsersService,
  getUserByIdService,
  createUserService,
  updateUserByIdService,
  deleteUserByIdService,
} = require("../models/user.model.js");

function handleResponse(res, status, message, data = null) {
  return res.status(status).json({ status, message, data });
}

/**
 * Retrieves all users from the database
 */
async function getAllUsers(req, res, next) {
  try {
    const users = await getAllUsersService();
    handleResponse(res, 200, "Users fetched successfully", users);
  } catch (error) {
    next(error);
  }
}

/**
 * Creates a new user in the database
 */
async function createUser(req, res, next) {
  try {
    const { cust_name, cust_age, cust_email, cust_city } = req.body || {};
    if (!cust_name || !cust_age || !cust_email || !cust_city) {
      return handleResponse(
        res,
        400,
        "All fields (cust_name, cust_age, cust_email, cust_city) are required",
      );
    }
    const user = await createUserService(req.body);
    handleResponse(res, 201, "User created successfully", user);
  } catch (error) {
    next(error);
  }
}

/**
 * Retrieves a single user by their ID
 */
async function getUserById(req, res, next) {
  try {
    const { id } = req.params;
    const user = await getUserByIdService(id);
    if (!user) return handleResponse(res, 404, "User not found");
    handleResponse(res, 200, "User fetched successfully", user);
  } catch (error) {
    next(error);
  }
}

/**
 * Updates an existing user by their ID
 */
async function updateUserById(req, res, next) {
  try {
    const { id } = req.params;
    const { cust_name, cust_age, cust_email, cust_city } = req.body || {};
    if (!cust_name && !cust_age && !cust_email && !cust_city) {
      return handleResponse(
        res,
        400,
        "At least one field (cust_name, cust_age, cust_email, cust_city) is required",
      );
    }
    const user = await updateUserByIdService(id, req.body);
    if (!user) return handleResponse(res, 404, "User not found");
    handleResponse(res, 200, "User updated successfully", user);
  } catch (error) {
    next(error);
  }
}

/**
 * Deletes a user by their ID
 */
async function deleteUserById(req, res, next) {
  try {
    const { id } = req.params;
    const user = await deleteUserByIdService(id);
    if (!user) return handleResponse(res, 404, "User not found");
    handleResponse(res, 200, "User deleted successfully", user);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllUsers,
  createUser,
  getUserById,
  updateUserById,
  deleteUserById,
};
