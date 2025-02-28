const express = require('express');
const router = express.Router();
const { getImpactWrenchData } = require('../controllers/impactWrenchController');

router.get('/:engineNo', getImpactWrenchData);

module.exports = router;