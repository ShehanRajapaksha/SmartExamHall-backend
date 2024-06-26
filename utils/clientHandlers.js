const PC = require("../models/PC");



exports.pcAssignHandler = async(clientId,ws)=>{
    try {
        // Send a message to the client indicating the device has been assigned
        

        // Store the client ID in the Pc table in the database
        const existingPc = await PC.findOne({ where: { id: clientId } });

        if (existingPc) {
            console.log(`PC ID: ${clientId} already exists in the database`);
            ws.send('PC ID already exists: ' + clientId);
        } else {
            // Store the client ID in the Pc table in the database
            await PC.create({ id: clientId, assigned: false });
            console.log(`Stored PC ID: ${clientId} in the database`);
        }

       
    } catch (error) {
        console.error('Error assigning PC:', error);
    }
    
}


exports.pcDeleteHandler = async (clientId) => {
    try {
        // Find and delete the PC from the database
        const pc = await PC.findOne({ where: { id: clientId } });

        if (pc) {
            await PC.destroy({ where: { id: clientId } });
            console.log(`Deleted PC ID: ${clientId} from the database`);
            // ws.send('Deleted PC ID: ' + clientId);
            return true
            
        } else {
            console.log(`PC ID: ${clientId} does not exist in the database`);
            // ws.send('PC ID does not exist: ' + clientId);
            return false
        }
    } catch (error) {
        console.error('Error deleting PC:', error);
        return false
     
    }
};


