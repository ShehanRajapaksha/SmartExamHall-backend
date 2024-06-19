const Student = require('./models/Student');
const PC = require('./models/PC');
const Allocation = require('./models/Allocation');

const allocatePCsToStudents = async () => {
  try {
    // Fetch all students and PCs
    const students = await Student.findAll();
    const pcs = await PC.findAll();

    if (students.length > pcs.length) {
      throw new Error('Not enough PCs for all students');
    }

    // Shuffle the PCs array
    const shuffledPCs = pcs.sort(() => Math.random() - 0.5);

    // Clear existing allocations
    await Allocation.destroy({ where: {} });

    // Allocate PCs to students
    const allocations = students.map((student, index) => ({
      studentId: student.id,
      pcId: shuffledPCs[index].id
    }));

    await Allocation.bulkCreate(allocations);

    console.log('PCs allocated successfully');
    return { message: 'PCs allocated successfully' };
  } catch (error) {
    console.error('Error during allocation:', error);
    throw error;
  }
};

module.exports = allocatePCsToStudents;
