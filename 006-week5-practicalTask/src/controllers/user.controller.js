const {
  getAllUsersService,
  getUserByIdService,
  createUserService,
  updateUserByIdService,
  deleteUserByIdService,
} = require("../models/user.model.js");
const { client } = require("../config/redis.js");

function handleResponse(res, status, message, data = null) {
  return res.status(status).json({ status, message, data });
}

/**
 * Retrieves all users from the database
 */
async function getAllUsers(req, res, next) {
  try {
    const cachedUsers = await client.get("users:all");
    if (cachedUsers) {
      console.log("Cache Hit!");
      return handleResponse(
        res,
        200,
        "Users fetched successfully",
        JSON.parse(cachedUsers),
      );
    }

    console.log("Cache Miss!");
    const users = await getAllUsersService();

    // Set cache to expire in 1 hour (3600 seconds)
    await client.setEx("users:all", 3600, JSON.stringify(users));

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

    // Invalidate the cache for all users
    await client.del("users:all");

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

    const cachedUser = await client.get(`user:${id}`);
    if (cachedUser) {
      console.log("Cache Hit!");
      return handleResponse(
        res,
        200,
        "User fetched successfully",
        JSON.parse(cachedUser),
      );
    }

    console.log("Cache Miss!");
    const user = await getUserByIdService(id);
    if (!user) return handleResponse(res, 404, "User not found");

    // Set cache to expire in 1 hour (3600 seconds)
    await client.setEx(`user:${id}`, 3600, JSON.stringify(user));

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

    // Invalidate caches
    await client.del("users:all");
    await client.del(`user:${id}`);

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

    // Invalidate caches
    await client.del("users:all");
    await client.del(`user:${id}`);

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
