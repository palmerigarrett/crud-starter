const express = require('express');
const cors = require('cors');
const app = express();
const { Pool } = require('pg');
const PORT = 8001; // or any other port you prefer

app.use(cors());
app.use(express.json());

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'crud',
    password: 'abcde12345',
    port: 5432, // default port for PostgreSQL
});

const createTable = () => {
  pool.query(
    `CREATE TABLE reactquery."BLOGPOST" (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255),
      author VARCHAR(255),
      content TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`, (err, res) => {
    if (err) {
      if (err.message.includes('relation "BLOGPOST" already exists')) {
        console.error('Table "BLOGPOST" already Exists');
      } else {
        console.error('error creating table BLOGPOST:', err.stack);
      }
    } else {
        console.log('Table BLOGPOST created');
    }
  });
};

const createSchema = () => {
  pool.query('CREATE SCHEMA reactquery', (err, res) => {
    if (err) {
      if (err.message.includes('schema "reactquery" already exists')) {
        console.error('Schema "reactquery" already Exists');
      } else {
        console.error('error creating schema:', err);
      }
    } else {
      console.log('Schema created successfully');
      createTable();
    }
  });
};

app.get('/blogposts', (req, res) => {
  pool.query('SELECT * FROM reactQuery."BLOGPOST"', (err, result) => {
      if (err) {
          console.log(err.stack);
          res.status(500).send('Internal server error');
      } else {
          res.send(result.rows);
      }
  });
});

app.post('/blogpost', (req, res) => {
  const {title, content, author} = req.body;

  pool.query(
    'INSERT INTO reactQuery."BLOGPOST" (title, content, author, created_at) VALUES ($1, $2, $3, $4) RETURNING *',
    [title, content, author, new Date()],
    (error, results) => {
      if (error) {
        console.error('error creating blogpost:', error);
        res.status(500).send('Internal server error');
      } else {
        console.log('Blog post created successfully');
        res.status(201).json(results.rows[0]);
      }
    }
  );
});

// Update a blog post by ID
app.put('/blogpost/:id', (req, res) => {
  const { title, content, author } = req.body;
  const id = req.params.id;

  pool.query(
    'UPDATE reactQuery."BLOGPOST" SET title=$1, content=$2, author=$3 WHERE id=$4 RETURNING *',
    [title, content, author, id],
    (error, results) => {
      if (error) {
        console.error('error updating blogpost:', error);
        res.status(500).send('Internal server error');
      } else if (results.rows.length === 0) {
        res.status(404).send('Blog post not found');
      } else {
        console.log('Blog post updated successfully');
        res.status(200).json(results.rows[0]);
      }
    }
  );
});

// Delete a blog post by ID
app.delete('/blogpost/:id', (req, res) => {
  const id = req.params.id;

  pool.query(
    'DELETE FROM reactQuery."BLOGPOST" WHERE id=$1 RETURNING *',
    [id],
    (error, results) => {
      if (error) {
        console.error('error deleting blogpost:', error);
        res.status(500).send('Internal server error');
      } else if (results.rows.length === 0) {
        res.status(404).send('Blog post not found');
      } else {
        console.log('Blog post deleted successfully');
        res.status(200).json(results.rows[0]);
      }
    }
  );
});


app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  createSchema();
});
