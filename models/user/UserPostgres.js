const pool = require('../config/dbPostgres');

// Create Users table if it doesn't exist
const createUsersTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      username VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      verified BOOLEAN DEFAULT false,
      verification_code VARCHAR(255),
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  try {
    await pool.query(query);
    console.log('Users table created or already exists');
  } catch (err) {
    console.error('Error creating Users table', err);
  }
};

// Call the function to create the table
createUsersTable();

module.exports = {
  // Add more functions as needed
};
