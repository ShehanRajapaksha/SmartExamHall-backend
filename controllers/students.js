const pool = require('../models/Student')
const asyncWrapper = require('../middleware/async')
const Student = require('../models/Student')
const e = require('express')

const getAllStudents = asyncWrapper(async (req, res, next) => {
    const students = await pool.findAll()
    res.status(200).json({ students, nbhits: students.length })
})


const createStudent = asyncWrapper(async (req, res, next) => {
    const { stu_id, name, batch, degree, fingerprint } = req.body;
    const Student = await pool.create({
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
    const Student = await pool.findByPk(stu_ID)
    if (!Student) {
        return res.status(404).json({ msg: `No task with id:${stu_ID}` })
    }
    res.send(Student)
})



const updateStudent = asyncWrapper(async (req, res, next) => {
    const { id: stu_ID } = req.params
    const Student = await pool.update(req.body, { where: { id: stu_ID } })
    res.status(200).json(Student)
})

const deleteStudent = asyncWrapper(async (req, res, next) => {
    const { id: stu_ID } = req.params
    await Student.destroy({ where: { id: stu_ID } })
    res.status(200).json(Student)
})

const verifyStudent = asyncWrapper(async (req, res, next) => {

    const { fingerprint: fingerprint } = req.body
    if (!fingerprint) {
        return res.status(400).json({ message: 'Fingerprint is required' });
    }
    const storedPrint = await Student.findOne({
        where: { fingerprint: fingerprint },
        attributes: ['stu_id']
    })

    if (storedPrint) {
        // Fingerprint found, grant access
        res.status(200).json({ message: 'Access granted', id: storedPrint });
    } else {
        // Fingerprint not found, deny access
        res.status(403).json({ message: 'Access denied' });
    }
})



module.exports = {
    getAllStudents,
    createStudent,
    updateStudent,
    deleteStudent,
    getStudent,
    verifyStudent
}