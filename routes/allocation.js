const express = require('express');
const router = express.Router();
const allocatePCsToStudents = require('../functions/allocate');

router.post('../functions/allocate', async (req, res, next) => {
  try {
    const result = await allocatePCsToStudents();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
