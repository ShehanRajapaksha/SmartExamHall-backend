const asyncWrapper = require("../middleware/async");
const PC = require("../models/PC");
const { sendMessageToClient,clients } = require("./fingerprints");



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
      // Fetch all PC IDs from the table
      const allPcs = await PC.findAll({ attributes: ['id'], transaction });
  
      // Send a 'deactivate' message to each PC
      allPcs.forEach(pc => {
        sendMessageToClient(pc.id, 'deactivate');
        clients.delete(pc.id); // Remove the client from the map
      });
  
      // Update assigned to false for all PCs
      await PC.update({ assigned: false }, { where: {}, transaction });
  
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