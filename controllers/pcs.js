const asyncWrapper = require("../middleware/async");
const PC = require("../models/PC");



const getAllPcs = asyncWrapper(async (req, res, next) => {
    try {
      const pcs = await PC.findAll(); // Fetch all data from the PC table
      res.status(200).json({
            pcs,
            nbhits:pcs.length
      });
    } catch (error) {
      next(error); // Pass the error to the error handling middleware
    }
  });


module.exports ={
    getAllPcs
}