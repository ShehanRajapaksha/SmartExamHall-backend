const Student = require('./models/Student');
const dummyData = require('./data.json');

async function populateData() {
  const jsonData = require('./data.json'); // Load JSON data from file

  const students = jsonData.students; // Extract the students array from JSON data

  await Student.sync({ force: true }); // Sync model to create table (use with caution)

  await Promise.all(students.map(async (data) => {
    await Student.create(data);
  }));

  console.log('Data populated successfully.');
  process.exit(); // Exit the script
}

populateData();