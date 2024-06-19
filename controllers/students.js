// const pool = require('../models/Student')
const asyncWrapper = require('../middleware/async')
const Student = require('../models/Student')
const e = require('express')

const getAllStudents = asyncWrapper(async (req, res, next) => {
    const students = await Student.findAll()
    res.status(200).json({ students, nbhits: students.length })
})


const createStudent = asyncWrapper(async (req, res, next) => {
    const { stu_id, name, batch, degree, fingerprint } = req.body;
    const Student = await Student.create({
        stu_id: stu_id,
        name: name,
        batch: batch,
        degree: degree,
        fingerprint: fingerprint



    })
    res.status(200).send("done")
})


const getStudent = asyncWrapper(async (req, res, next) => {
    const { id: stu_ID } = req.params
    const Student = await Student.findByPk(stu_ID)
    if (!Student) {
        return res.status(404).json({ msg: `No task with id:${stu_ID}` })
    }
    res.send(Student)
})



const updateStudent = asyncWrapper(async (req, res, next) => {
    const { id: stu_ID } = req.params
    const Student = await Student.update(req.body, { where: { id: stu_ID } })
    res.status(200).json(Student)
})

const deleteStudent = asyncWrapper(async (req, res, next) => {
    const { id: stu_ID } = req.params
    await Student.destroy({ where: { id: stu_ID } })
    res.status(200).json(Student)
})





module.exports = {
    getAllStudents,
    createStudent,
    updateStudent,
    deleteStudent,
    getStudent,
    
}