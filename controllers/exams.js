const asyncWrapper = require('../middleware/async');
const e = require('express');
const Exam = require('../models/Exam');
const WebSocket = require('ws'); 

const createExam = asyncWrapper(async (req, res, next) => {
    const { module, date, duration,instructions } = req.body;

    if (!module || !date || !duration) {
        const err = new Error('Module, date, and duration are required')
        err.status(400)
        return next(err)
    }



    try {

        const existingExam = await Exam.findOne({ where: { module } });

        if (existingExam) {
            const err = new Error('An exam with this module name already exists');
            err.status = 400;
            return next(err);
        }


        const newExam = await Exam.create({
            module,
            date,
            duration,
            active:false,
            instructions
        });

        res.status(201).json(newExam);
    } catch (error) {
        next(error); // Passes error to the error handling middleware
    }
});


const getAllExam = asyncWrapper(async (req, res, next) => {
    try {
        const exams = await Exam.findAll();
        res.status(200).json({ exams, nbhits: exams.length });
    } catch (error) {
        next(error); // Passes error to the error handling middleware
    }
});

const updateExam = asyncWrapper(async (req, res, next) => {
    const { id: exam_ID } = req.params;
    try {
        const [updated] = await Exam.update(req.body, { where: { exam_id: exam_ID } });

        if (updated === 0) {
            const error = new Error('Exam not found');
            error.status = 404;
            return next(error); // Passes error to the error handling middleware
        }

        const updatedExam = await Exam.findOne({ where: { exam_id: exam_ID } });
        res.status(200).json(updatedExam);
    } catch (error) {
        next(error); // Passes error to the error handling middleware
    }
});

const deleteExam = asyncWrapper(async (req, res, next) => {
    const { id: exam_ID } = req.params;
    try {
        // Check if the exam exists
        const exam = await Exam.findOne({ where: { exam_id: exam_ID } });

        if (!exam) {
            const error = new Error('Exam not found');
            error.status = 404;
            return next(error); // Passes error to the error handling middleware
        }

        // Delete the exam
        await Exam.destroy({ where: { exam_id: exam_ID } });

        res.status(200).json({ message: 'Exam deleted successfully' });
    } catch (error) {
        next(error); // Passes error to the error handling middleware
    }
});


const setActive = asyncWrapper(async (req, res, next) => {
    const { examId, active } = req.body;

    if (examId === undefined || active === undefined) {
        const err = new Error('Exam ID and active status are required');
        err.status = 400;
        return next(err);
    }

    

    try {
        // Check if the exam exists
        const exam = await Exam.findOne({ where: { exam_id: examId } });

        if (!exam) {
            const error = new Error('Exam not found');
            error.status = 404;
            return next(error); // Passes error to the error handling middleware
        }

        // Update the active status
        await Exam.update(
            { active: active === 1 },
            { where: { exam_id: examId } }
        );

        res.status(200).json({ message: `Exam ${active === 1 ? 'activated' : 'deactivated'} successfully` });
    } catch (error) {
        next(error); // Passes error to the error handling middleware
    }
});


const getExamById = asyncWrapper(async (req, res, next) => {
    const { id: examId } = req.params;

    try {
        const exam = await Exam.findOne({ where: { exam_id: examId } });

        if (!exam) {
            const error = new Error('Exam not found');
            error.status = 404;
            return next(error);
        }

        res.status(200).json(exam);
    } catch (error) {
        console.log(error);
        next(error); // Passes error to the error handling middleware
    }
});

const startExam = async (clients, req, res, next) => {
    try {
        const activeExam = await Exam.findOne({ where: { active: true } });

        if (!activeExam) {
            const error = new Error('No active exam found');
            error.status = 404;
            return next(error);
        }

        const duration = activeExam.duration * 60; // convert minutes to seconds

        let timeLeft = duration;

        // Function to broadcast the remaining time to all connected clients
        const broadcastTime = () => {
            // const message = JSON.stringify({ type: 'countdown', timeLeft });
            const message = `timer,${timeLeft}`;
            clients.forEach((client, clientId) => {
                if (client.readyState === WebSocket.OPEN && clientId.startsWith('pc')) {
                    client.send(message);
                }
            });
        };

        // Broadcast the initial time
        broadcastTime();

        // Start the countdown timer
        const countdownInterval = setInterval(() => {
            timeLeft -= 1;
            broadcastTime();

            if (timeLeft <= 0) {
                clearInterval(countdownInterval);
                // Optionally, broadcast that the exam has ended
                const endMessage = JSON.stringify({ type: 'examEnded' });
                clients.forEach((client, clientId) => {
                    if (client.readyState === WebSocket.OPEN && clientId.startsWith('pc')) {
                        client.send(endMessage);
                    }
                });
            }
        }, 1000);

        res.status(200).json({ message: 'Exam started successfully', duration });
    } catch (error) {
        next(error); // Passes error to the error handling middleware
    }
};


module.exports = {
    createExam,
    getAllExam,
    updateExam,
    deleteExam,
    setActive,
    getExamById,
    startExam
};