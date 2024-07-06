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

  const resetAllPcsAssignedStatus = asyncWrapper(async (req, res, next) => {
    const transaction = await PC.sequelize.transaction();
    try {
      await PC.update({ assigned: false }, { where: {}, transaction }); // Update assigned to false for all PCs
      await transaction.commit();
      res.status(200).json({
        message: "All PCs assigned status reset to false"
      });
    } catch (error) {
      await transaction.rollback();
      next(error); // Pass the error to the error handling middleware
    }
  });


module.exports ={
    getAllPcs,
    resetAllPcsAssignedStatus
}