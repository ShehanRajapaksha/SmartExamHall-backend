const Attendence = require("./Attendence")
const Exam = require("./Exam")
const Fingerprint = require("./Fingerprint")
const PC = require("./PC")
const Student = require("./Student")



Student.belongsToMany(Exam, { through: Attendence, foreignKey: 'student_id' });
Exam.belongsToMany(Student, { through: Attendence, foreignKey: 'exam_id' });

Student.hasOne(Fingerprint, { foreignKey: 'stu_id' });
Fingerprint.belongsTo(Student, { foreignKey: 'stu_id' });

PC.hasMany(Attendence, { foreignKey: 'pc_id' });
Attendence.belongsTo(PC, { foreignKey: 'pc_id' });


module.exports = { Student, Exam, Attendence, Fingerprint, PC };
