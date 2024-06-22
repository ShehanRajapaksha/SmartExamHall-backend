// const pool = require('../models/Student')
const asyncWrapper = require('../middleware/async')
const Student = require('../models/Student')
const e = require('express')

const getAllStudents = asyncWrapper(async (req, res, next) => {
    try {
        const students = await Student.findAll();
        res.status(200).json({ students, nbhits: students.length });
    } catch (error) {
        next(error); // Pass any errors to the error handling middleware
    }
});


const createStudent = asyncWrapper(async (req, res, next) => {
    const { stu_id, name, batch, degree, fingerprint } = req.body;

    if (!stu_id || !name || !batch || !degree) {
        const error = new Error('All data are required');
        error.status = 400;
        return next(error); // Ensure the error is returned
    }

    try {
        const newStudent = await Student.create({
            stu_id: stu_id,
            name: name,
            batch: batch,
            degree: degree,
        });

        res.status(201).json(newStudent); // Respond with the created student
    } catch (error) {
        next(error); // Pass the error to the error handling middleware
    }
});


const getStudent = asyncWrapper(async (req, res, next) => {
   try {
     const { id: stu_ID } = req.params
    

     const Student = await Student.findByPk(stu_ID)
     if (!Student) {
        //  return res.status(404).json({ msg: `No task with id:${stu_ID}` })
         const error=new Error(`No student with id:${stu_ID}`)
         error.status =404
         next(error)
     }
     res.send(Student)
   } catch (error) {
    
    next(error)
   
    }

})


const updateStudent = asyncWrapper(async (req, res, next) => {
    try {
        const { id: stu_ID } = req.params;
        const [updated] = await Student.update(req.body, { where: { stu_id: stu_ID } });
  
        if (updated === 0) {
            const error = new Error('Student not found');
            error.status = 404;
            return next(error); // Pass the error to the error handling middleware
        }
  
        const updatedStudent = await Student.findOne({ where: { stu_id: stu_ID } });
        res.status(200).json(updatedStudent);
    } catch (error) {
        next(error); // Pass any other errors to the error handling middleware
    }
  })

  const deleteStudent = asyncWrapper(async (req, res, next) => {
    const { id: stu_ID } = req.params;

    try {
        // Check if the student exists
        const student = await Student.findOne({ where: { stu_id: stu_ID } });

        if (!student) {
            const error = new Error('Student not found');
            error.status = 404;
            return next(error); // Pass the error to the error handling middleware
        }

        // Delete the student
        await Student.destroy({ where: { stu_id: stu_ID } });

        res.status(200).json({ message: 'Student deleted successfully' });
    } catch (error) {
        next(error); // Pass any other errors to the error handling middleware
    }
});





module.exports = {
    getAllStudents,
    createStudent,
    updateStudent,
    deleteStudent,
    getStudent,
    
}