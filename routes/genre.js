const express = require('express');
const router = express.Router();
const genreController = require('../controller/genreController');
const auth = require('../middleware/auth');

router.get('/', genreController.getGenres);
router.post('/', auth, genreController.addGenre);
router.delete('/:id', auth, genreController.deleteGenre);

module.exports = router;
