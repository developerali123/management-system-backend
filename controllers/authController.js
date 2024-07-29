const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserMongo = require('../models/user/UserMongo');
const pool = require('../config/dbPostgres');
const { addToBlacklist } = require('../tokenBlacklist');

// Helper function to generate JWT
const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: '1y', // 1 year
  });
};

// Signup (MongoDB)
const signupMongo = async (req, res) => {
  const { email, username, password } = req.body;
  try {
    const existingUser = await UserMongo.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ status: 'error', msg: 'Email already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
    const newUser = new UserMongo({ email, username, password: hashedPassword, verificationCode });
    await newUser.save();
    res.status(201).json({ status: 'success', msg: 'User created', verifyCode: verificationCode });
  } catch (err) {
    res.status(500).json({ status: 'error', msg: 'Error creating user', error: err.message });
  }
};

// Signup (PostgreSQL)
const signupPostgres = async (req, res) => {
  const { email, username, password } = req.body;
  try {
    const userQuery = 'SELECT * FROM users WHERE email = $1';
    const userResult = await pool.query(userQuery, [email]);
    if (userResult.rows.length > 0) {
      return res.status(400).json({ status: 'error', msg: 'Email already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
    const insertQuery = `
      INSERT INTO users (email, username, password, verification_code)
      VALUES ($1, $2, $3, $4) RETURNING *
    `;
    const values = [email, username, hashedPassword, verificationCode];
    const result = await pool.query(insertQuery, values);
    res.status(201).json({ status: 'success', msg: 'User created', verifyCode: verificationCode });
  } catch (err) {
    res.status(500).json({ status: 'error', msg: 'Error creating user', error: err.message });
  }
};

// Login (MongoDB)
const loginMongo = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserMongo.findOne({ email });
    if (!user) {
      return res.status(400).json({ status: 'error', msg: 'Invalid email or password' });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ status: 'error', msg: 'Invalid email or password' });
    }
    const token = generateToken(user);
    res.status(200).json({ status: 'success', msg: 'Logged in', user, token });
  } catch (err) {
    res.status(500).json({ status: 'error', msg: 'Error logging in', error: err.message });
  }
};

// Login (PostgreSQL)
const loginPostgres = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userQuery = 'SELECT * FROM users WHERE email = $1';
    const userResult = await pool.query(userQuery, [email]);
    if (userResult.rows.length === 0) {
      return res.status(400).json({ status: 'error', msg: 'Invalid email or password' });
    }
    const user = userResult.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ status: 'error', msg: 'Invalid email or password' });
    }
    const token = generateToken(user);
    res.status(200).json({ status: 'success', msg: 'Logged in', user, token });
  } catch (err) {
    res.status(500).json({ status: 'error', msg: 'Error logging in', error: err.message });
  }
};

// Verify User (MongoDB)
const verifyUserMongo = async (req, res) => {
  const { email, verificationCode } = req.body;
  try {
    const user = await UserMongo.findOne({ email });
    if (!user || user.verificationCode !== verificationCode) {
      return res.status(400).json({ status: 'error', msg: 'Invalid verification code' });
    }
    user.verified = true;
    user.verificationCode = null; // Clear the verification code
    await user.save();
    res.status(200).json({ status: 'success', msg: 'User verified' });
  } catch (err) {
    res.status(500).json({ status: 'error', msg: 'Error verifying user', error: err.message });
  }
};

// Verify User (PostgreSQL)
const verifyUserPostgres = async (req, res) => {
  const { email, verificationCode } = req.body;
  try {
    const userQuery = 'SELECT * FROM users WHERE email = $1';
    const userResult = await pool.query(userQuery, [email]);
    if (userResult.rows.length === 0 || userResult.rows[0].verification_code !== verificationCode) {
      return res.status(400).json({ status: 'error', msg: 'Invalid verification code' });
    }
    const updateQuery = `
      UPDATE users SET verified = true, verification_code = NULL WHERE email = $1 RETURNING *
    `;
    await pool.query(updateQuery, [email]);
    res.status(200).json({ status: 'success', msg: 'User verified' });
  } catch (err) {
    res.status(500).json({ status: 'error', msg: 'Error verifying user', error: err.message });
  }
};

// Verify Email (MongoDB)
const verifyEmailMongo = async (req, res) => {
    const { email } = req.body;
    try {
      const user = await UserMongo.findOne({ email });
      if (!user) {
        return res.status(404).json({ status: 'error', msg: 'Email not found' });
      }
      res.status(200).json({ status: 'success', msg: 'Email exists', email });
    } catch (err) {
      res.status(500).json({ status: 'error', msg: 'Error checking email', error: err.message });
    }
  };

  // Verify Email (PostgreSQL)
const verifyEmailPostgres = async (req, res) => {
    const { email } = req.body;
    try {
      const userQuery = 'SELECT * FROM users WHERE email = $1';
      const userResult = await pool.query(userQuery, [email]);
      if (userResult.rows.length === 0) {
        return res.status(404).json({ status: 'error', msg: 'Email not found' });
      }
      res.status(200).json({ status: 'success', msg: 'Email exists', email });
    } catch (err) {
      res.status(500).json({ status: 'error', msg: 'Error checking email', error: err.message });
    }
  };
  

// Forgot Password (MongoDB)
const forgotPasswordMongo = async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    const user = await UserMongo.findOne({ email });
    if (!user) {
      return res.status(400).json({ status: 'error', msg: 'Email not found' });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    res.status(200).json({ status: 'success', msg: 'Password updated' });
  } catch (err) {
    res.status(500).json({ status: 'error', msg: 'Error updating password', error: err.message });
  }
};

// Forgot Password (PostgreSQL)
const forgotPasswordPostgres = async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    const userQuery = 'SELECT * FROM users WHERE email = $1';
    const userResult = await pool.query(userQuery, [email]);
    if (userResult.rows.length === 0) {
      return res.status(400).json({ status: 'error', msg: 'Email not found' });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updateQuery = `
      UPDATE users SET password = $1 WHERE email = $2 RETURNING *
    `;
    await pool.query(updateQuery, [hashedPassword, email]);
    res.status(200).json({ status: 'success', msg: 'Password updated' });
  } catch (err) {
    res.status(500).json({ status: 'error', msg: 'Error updating password', error: err.message });
  }
};

// Signout (Invalidate Token)

const signout = (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(400).json({ status: 'error', msg: 'No token provided' });
    }
  
    // Verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ status: 'error', msg: 'Invalid token' });
      }
  
      // Extract user information from decoded token
      const { id, email } = decoded;
  
      // Validate id and email
      if (!req.body.id || !req.body.email) {
        return res.status(400).json({ status: 'error', msg: 'ID and email are required' });
      }
  
      if (req.body.id !== id || req.body.email !== email) {
        return res.status(403).json({ status: 'error', msg: 'Invalid user credentials' });
      }
  
      // Add token to the blacklist
      addToBlacklist(token);
  
      return res.status(200).json({ status: 'success', msg: 'Signed out' });
    });
  };


module.exports = {
  signupMongo,
  signupPostgres,
  loginMongo,
  loginPostgres,
  verifyUserMongo,
  verifyUserPostgres,
  verifyEmailMongo,
  verifyEmailPostgres,
  forgotPasswordMongo,
  forgotPasswordPostgres,
  signout,
};
