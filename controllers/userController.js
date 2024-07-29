const pool = require("../config/dbPostgres");
const UserMongo = require("../models/user/UserMongo");

// Get all users (MongoDB)
const getAllUsersMongo = async (req, res) => {
  try {
    const users = await UserMongo.find();
    res.status(200).json({ status: 'success', msg: 'Users retrieved', users });
  } catch (err) {
    res.status(500).json({ status: 'error', msg: 'Error retrieving users', error: err.message });
  }
};

// Get user by ID (MongoDB)
const getUserByIdMongo = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await UserMongo.findById(id);
    if (!user) {
      return res.status(404).json({ status: 'error', msg: 'User not found' });
    }
    res.status(200).json({ status: 'success', msg: 'User retrieved', user });
  } catch (err) {
    res.status(500).json({ status: 'error', msg: 'Error retrieving user', error: err.message });
  }
};

// Update user by ID (MongoDB)
const updateUserByIdMongo = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  try {
    const user = await UserMongo.findByIdAndUpdate(id, updateData, { new: true });
    if (!user) {
      return res.status(404).json({ status: 'error', msg: 'User not found' });
    }
    res.status(200).json({ status: 'success', msg: 'User updated', user });
  } catch (err) {
    res.status(500).json({ status: 'error', msg: 'Error updating user', error: err.message });
  }
};

// Delete user by ID (MongoDB)
const deleteUserByIdMongo = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await UserMongo.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ status: 'error', msg: 'User not found' });
    }
    res.status(200).json({ status: 'success', msg: 'User deleted' });
  } catch (err) {
    res.status(500).json({ status: 'error', msg: 'Error deleting user', error: err.message });
  }
};

// Delete all users (MongoDB)
const deleteAllUsersMongo = async (req, res) => {
  try {
    await UserMongo.deleteMany();
    res.status(200).json({ status: 'success', msg: 'All users deleted' });
  } catch (err) {
    res.status(500).json({ status: 'error', msg: 'Error deleting users', error: err.message });
  }
};

// Get all users (PostgreSQL)
const getAllUsersPostgres = async (req, res) => {
  try {
    const users = await pool.query('SELECT * FROM users');
    res.status(200).json({ status: 'success', msg: 'Users retrieved', users: users.rows });
  } catch (err) {
    res.status(500).json({ status: 'error', msg: 'Error retrieving users', error: err.message });
  }
};

// Get user by ID (PostgreSQL)
const getUserByIdPostgres = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    if (user.rows.length === 0) {
      return res.status(404).json({ status: 'error', msg: 'User not found' });
    }
    res.status(200).json({ status: 'success', msg: 'User retrieved', user: user.rows[0] });
  } catch (err) {
    res.status(500).json({ status: 'error', msg: 'Error retrieving user', error: err.message });
  }
};

// Update user by ID (PostgreSQL)
const updateUserByIdPostgres = async (req, res) => {
  const { id } = req.params;
  const { email, username, password, verified } = req.body;
  try {
    const updateQuery = `
      UPDATE users
      SET email = $1, username = $2, password = $3, verified = $4, updated_at = NOW()
      WHERE id = $5 RETURNING *
    `;
    const user = await pool.query(updateQuery, [email, username, password, verified, id]);
    if (user.rows.length === 0) {
      return res.status(404).json({ status: 'error', msg: 'User not found' });
    }
    res.status(200).json({ status: 'success', msg: 'User updated', user: user.rows[0] });
  } catch (err) {
    res.status(500).json({ status: 'error', msg: 'Error updating user', error: err.message });
  }
};

// Delete user by ID (PostgreSQL)
const deleteUserByIdPostgres = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
    if (user.rows.length === 0) {
      return res.status(404).json({ status: 'error', msg: 'User not found' });
    }
    res.status(200).json({ status: 'success', msg: 'User deleted' });
  } catch (err) {
    res.status(500).json({ status: 'error', msg: 'Error deleting user', error: err.message });
  }
};

// Delete all users (PostgreSQL)
const deleteAllUsersPostgres = async (req, res) => {
  try {
    await pool.query('DELETE FROM users');
    res.status(200).json({ status: 'success', msg: 'All users deleted' });
  } catch (err) {
    res.status(500).json({ status: 'error', msg: 'Error deleting users', error: err.message });
  }
};

module.exports = {
  getAllUsersMongo,
  getUserByIdMongo,
  updateUserByIdMongo,
  deleteUserByIdMongo,
  deleteAllUsersMongo,
  getAllUsersPostgres,
  getUserByIdPostgres,
  updateUserByIdPostgres,
  deleteUserByIdPostgres,
  deleteAllUsersPostgres,
};
