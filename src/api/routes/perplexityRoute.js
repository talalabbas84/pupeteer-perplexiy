const express = require('express');
const PerplexityController = require('../controllers/perplexityController');
const router = express.Router();

router.post('/search', PerplexityController.search);

module.exports = router;
