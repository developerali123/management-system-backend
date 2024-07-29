const express = require('express');
const dotenv = require('dotenv');
const connectMongoDB = require('./config/dbMongo');
const pool = require('./config/dbPostgres');
const swaggerApp = require('./swagger');
const authroutes = require('./routes/authroutes');
const userroutes = require('./routes/userroutes');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/', authroutes);
app.use('/users', userroutes);
app.use(swaggerApp);
// connectMongoDB(); // Establish MongoDB connection

// Optional: Test PostgreSQL connection explicitly
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error executing query', err.stack);
  } else {
    console.log('PostgreSQL current time:', res.rows[0]);
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
