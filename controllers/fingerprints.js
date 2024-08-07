// controllers/verifyStudent.js
const Fingerprint = require("../models/Fingerprint");
const asyncWrapper = require('../middleware/async');
const e = require('express');
const Student = require("../models/Student");
const { Sequelize } = require("sequelize");
const WebSocket = require('ws');
const { pcAssign } = require("../utils/pcAssign");
const PC = require("../models/PC");
const Exam = require("../models/Exam");
const Attendence = require("../models/Attendence");

let wss;
let clients;  

const setWss = (wsServer, clientMap) => {
    wss = wsServer;
    clients = clientMap;
};

const sendMessageToClient = (clientId, message) => {
  const client = clients.get(clientId);
  if (client && client.readyState === WebSocket.OPEN) {
      client.send(message);
      return true
  } else {
      console.log(`Client ${clientId} not connected or not found`);
      return false
  }
};


const verifyStudent = asyncWrapper(async (req, res, next) => {
  const { fingerprint_id } = req.body;

  if (fingerprint_id === undefined || fingerprint_id === null) {
      // return res.status(400).json({ error: 'Fingerprint ID is required' });
      let error = new Error('Fingerprint ID is required').status(400)
      next(error)
  }

  try {
      // Find the student with the given fingerprint ID
      const fingerprint = await Fingerprint.findOne({ where: { id: fingerprint_id } });

      if (!fingerprint) {
        const error = new Error('Student not found');
        error.status = 404;
        return next(error); // Ensure the function returns immediately after calling next
    }

      // Assign a PC
      const pcId = await pcAssign();

      if (pcId === -1) {
        const error = new Error('No available PCs for assignment');
        error.status = 404;
        return next(error); 
      }

      const activeExam = await Exam.findOne({ where: { active: true } });
            if (!activeExam) {
                const error = new Error('No active exam found');
                error.status = 404;
                return next(error); // Ensure the function returns immediately after calling next
            }

      // Send activation message to the assigned PC
     
      const messageSent = sendMessageToClient(pcId, `activate,${fingerprint.stu_id},${activeExam.exam_id}`);
      // const messageSent = sendMessageToClient(pcId, `activate`);

      if (messageSent) {
          // Update the PC record in the database 
         
          
          

          await PC.update(
              { assigned: true},
              { where: { id: pcId } }
          );

            // Create a new attendance record
            const newAttendance = await Attendence.create({
                exam_id: activeExam.exam_id,
                student_id: fingerprint.stu_id,
                pc_id: pcId
            });

            console.log(`Assigned PC ID: ${pcId} to student ID: ${fingerprint.stu_id} for exam ID: ${activeExam.exam_id}`);
            return res.status(200).json({ 
              studentId: fingerprint.stu_id, 
              pcId: pcId.replace('pc', ''), // Remove 'pc' part from pcId
              examId: activeExam.exam_id 
            });
      } else {
        const error = new Error('Failed to send activation message to the PC');
        error.status = 500;
        return next(error)
      } 
  } catch (error) {
    console.error('Error verifying student:', error);
    return next(error); // Pass the error to the error handling middleware
  }
});


const createFingerprint = asyncWrapper(async (req, res, next) => {
    const { fingerprint_id } = req.body;
  
    if (fingerprint_id === undefined || fingerprint_id === null) {
      // return res.status(400).json({ error: 'Fingerprint data is required' });
      const error = new Error('Fingerprint data is required')
      error.status=400
      return next(error)
    }
  
    try {
      // Find the last `stu_id` in the `students` table that is not in the `fingerprints` table
      const student = await Student.findOne({
        where: {
          stu_id: {
            [Sequelize.Op.notIn]: Sequelize.literal(`(SELECT stu_id FROM Fingerprints)`)
          }
        },
        order: [['stu_id', 'DESC']]
      });
  
      if (!student) {
        // return res.status(404).json({ error: 'No available student found for the fingerprint record' });
        const error = new Error('No available student found for the fingerprint record')
        error.status=404
        return next(error)
      }
  
      // Create a new fingerprint record
      const newFingerprint = await Fingerprint.create({
        id:fingerprint_id,
        stu_id: student.stu_id,
      });
  
      return res.status(201).json(newFingerprint);
    } catch (error) {
      console.log(error);
      next(error)
    }
  });



  const setMode = asyncWrapper(async (req, res, next) => {
    const { mode } = req.body;

    if (mode === undefined || mode === null) {
        // return res.status(400).json({ error: 'Mode is required' });
        const error = new Error('Mode is required')
        error.status=400
        return next(error)
    }

    try {
        // Send a message to WebSocket clients based on the mode
        if (wss) {
          if (mode === 1) {
            sendMessageToClient('fp1', '1');
        } else if (mode === 2) {
            sendMessageToClient('fp1', '2');
        } else if (mode === 3) {
            sendMessageToClient('fp1', '3');
        }
        }

        return res.status(200).json({ message: 'Mode change message sent' });
    } catch (error) {
       next(error)
    }
});



const manualAttendance = asyncWrapper(async (req, res, next) => {
  const { indexNumber } = req.body;

  if (indexNumber === undefined || indexNumber === null) {
      const error = new Error('Index number is required');
      error.status = 400;
      return next(error);
  }

  try {
      const student = await Student.findOne({ where: { stu_id: indexNumber } });

      if (!student) {
          const error = new Error('Student not found');
          error.status = 404;
          return next(error);
      }

      const pcId = await pcAssign();

      if (pcId === -1) {
          const error = new Error('No available PCs for assignment');
          error.status = 404;
          return next(error);
      }

      const activeExam = await Exam.findOne({ where: { active: true } });
      if (!activeExam) {
          const error = new Error('No active exam found');
          error.status = 404;
          return next(error);
      }
      // const msg ={studentId:student.stu_id,examId:activeExam.exam_id,status:'active'}
      const messageSent = sendMessageToClient(pcId, `activate,${student.stu_id},${activeExam.exam_id}`);

      if (messageSent) {
        

          await PC.update(
              { assigned: true },
              { where: { id: pcId } }
          );

          const newAttendance = await Attendence.create({
              exam_id: activeExam.exam_id,
              student_id: student.stu_id,
              pc_id: pcId
          });

          console.log(`Assigned PC ID: ${pcId} to student ID: ${student.stu_id} for exam ID: ${activeExam.exam_id}`);
          return res.status(200).json({ 
              studentId: student.stu_id, 
              pcId: pcId.replace('pc', ''), 
              examId: activeExam.exam_id 
          });
      } else {
          const error = new Error('Failed to send activation message to the PC');
          error.status = 500;
          return next(error);
      }
  } catch (error) {
      console.error('Error handling manual attendance:', error);
      return next(error);
  }
});



const revokeAttendance = asyncWrapper(async (req, res, next) => {
  const { pcId } = req.body;

  if (pcId === undefined || pcId === null) {
    const error = new Error('PC ID is required');
    error.status = 400;
    return next(error);
  }

  try {
    // Find the PC with the given ID
    const pc = await PC.findOne({ where: { id: pcId } });

    if (!pc) {
      const error = new Error('PC not found');
      error.status = 404;
      return next(error);
    }

    // Update the PC's assigned status to false
    await PC.update(
      { assigned: false },
      { where: { id: pcId } }
    );

    // Send a 'deactivate' message to the PC client
    const messageSent = sendMessageToClient(pcId, 'deactivate');


    if (messageSent) {
      return res.status(200).json({ message: `PC ID: ${pcId} deactivated successfully` });
    } else {
      const error = new Error('Failed to send deactivate message to the PC');
      error.status = 500;
      return next(error);
    }
  } catch (error) {
    console.error('Error revoking attendance:', error);
    return next(error); // Pass the error to the error handling middleware
  }
});


module.exports = { verifyStudent, createFingerprint, setWss, setMode, manualAttendance,revokeAttendance,sendMessageToClient };
