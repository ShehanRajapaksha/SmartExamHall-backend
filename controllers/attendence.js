const { Attendence, Exam, Student } = require('../models/associations');
const asyncWrapper = require('../middleware/async');
const { Op } = require('sequelize');

const getAttendence = asyncWrapper(async (req, res, next) => {
  const { degree, date } = req.body;

  if (!degree || !date) {
    const error = new Error('Degree and date are required');
    error.status = 400;
    return next(error);
  }

  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  try {
    // Fetch all attendance records for the specified date
    const attendances = await Attendence.findAll({
      where: {
        createdAt: {
            [Op.between]: [startOfDay, endOfDay]
        }
      },
      include: [
        {
          model: Exam
        },
        {
          model: Student,
          where: {
            degree
          }
        }
      ]
    });
    console.log("data",attendances);

    // Extract relevant data from attendance records
    const result = attendances.map(attendance => {
      return {
        createdAt: attendance.createdAt,
        exam: {
          examId: attendance.Exam.exam_id,
          module: attendance.Exam.module,
          date: attendance.Exam.date,
          duration: attendance.Exam.duration
        },
        student: {
          studentId: attendance.Student.stu_id,
          name: attendance.Student.name,
          batch: attendance.Student.batch,
          degree: attendance.Student.degree
        },
        pc:{
          pcId:attendance.pc_id
        }
      };
    });

    res.status(200).json(result);
  } catch (error) {
    next(error); // Passes error to the error handling middleware
  }
});

const getAttendenceForActiveExams = asyncWrapper(async (req, res, next) => {
    try {
      // Fetch all active exams
      const activeExams = await Exam.findAll({
        where: {
          active: true
        }
      });
  
      if (!activeExams.length) {
        return res.status(404).json({ message: 'No active exams found' });
      }
  
      // Extract active exam IDs
      const activeExamIds = activeExams.map(exam => exam.exam_id);
  
      // Fetch attendance records for active exam IDs
      const attendances = await Attendence.findAll({
        where: {
          exam_id: {
            [Op.in]: activeExamIds
          }
        }
      });
  
      // Extract relevant data from attendance records
      const result = attendances.map(attendance => {
        return {
          createdAt: attendance.createdAt,
          examId: attendance.exam_id,
          studentId: attendance.student_id,
          pcId: attendance.pc_id
        };
      });
  
      res.status(200).json(result);
    } catch (error) {
      next(error); // Passes error to the error handling middleware
    }
  });
  

module.exports = {
  getAttendence,
  getAttendenceForActiveExams
};