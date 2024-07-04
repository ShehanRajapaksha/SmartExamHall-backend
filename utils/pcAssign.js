const PC = require("../models/PC");


exports.pcAssign = async()=>{
    try {
        // Get all PCs that do not have assigned set to true
        const unassignedPcs = await PC.findAll({ where: { assigned: false } });

        if (unassignedPcs.length === 0) {
            console.log("NO PC available");
            return -1;
        }

        // Pick a random PC from the unassigned PCs
        const randomPc = unassignedPcs[Math.floor(Math.random() * unassignedPcs.length)];
        
        // Return the ID of the selected PC
        return randomPc.id;
    } catch (error) {
        console.error('Error in pcAssign:', error);
        return -1;
    }
}
