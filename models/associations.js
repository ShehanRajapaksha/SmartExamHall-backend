const Attendence = require("./Attendence")
const Exam = require("./Exam")
const Fingerprint = require("./Fingerprint")
const PC = require("./PC")
const Student = require("./Student")




// Student and Fingerprint Relationship (1:1)
Student.hasOne(Fingerprint, { foreignKey: 'stu_id' });
Fingerprint.belongsTo(Student, { foreignKey: 'stu_id' });


//PC and Attendence Relationship (1:M)
PC.hasMany(Attendence, { foreignKey: 'pc_id' });
Attendence.belongsTo(PC, { foreignKey: 'pc_id' });


// Exam and Attendence Relationship (1:M)
Exam.hasMany(Attendence,{foreignKey:'exam_id'})
Attendence.belongsTo(Exam,{foreignKey:'exam_id'})

// Student and Attendence Relationship (1:M)
Student.hasMany(Attendence, { foreignKey: 'student_id' });
Attendence.belongsTo(Student, { foreignKey: 'student_id' });

module.exports = { Student, Exam, Attendence, Fingerprint, PC };
