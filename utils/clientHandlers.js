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