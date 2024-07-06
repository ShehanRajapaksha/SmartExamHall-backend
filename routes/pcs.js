const express = require('express');
const { getAllPcs, resetAllPcsAssignedStatus } = require('../controllers/pcs.js');

const router =express.Router();



router.route('/').get(getAllPcs).put(resetAllPcsAssignedStatus)

module.exports = router