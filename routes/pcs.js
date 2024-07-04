const express = require('express');
const { getAllPcs } = require('../controllers/pcs.js');

const router =express.Router();



router.route('/').get(getAllPcs)

module.exports = router