const db = require('../db/connect');
const redis = require('ioredis');
const redisClient = new redis();
const express = require('express');
const router = express.Router();

// Get all genres
const getGenres = async (req, res) => {
  try {
    const genres = await redisClient.get('genres');
    if (genres) {
      return res.status(200).json(JSON.parse(genres));
    }
    db.all('SELECT * FROM genres', (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      redisClient.set('genres', JSON.stringify(rows));
      return res.status(200).json(rows);
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Add a genre
const addGenre = async (req, res) => {
  const { genre } = req.body;
  if (!genre) {
    return res.status(400).json({ error: 'Genre is required.' });
  }
  try {
    await db.run('INSERT INTO genres (genre) VALUES (?)', genre);
    redisClient.del('genres');
    return res.status(201).json({ message: 'Genre added.' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Delete a genre
const deleteGenre = async (req, res) => {
  const { id } = req.params;
  try {
    await db.run('DELETE FROM genres WHERE id = ?', id);
    redisClient.del('genres');
    return res.status(200).json({ message: 'Genre deleted.' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getGenres,
  addGenre,
  deleteGenre,
};
