// controllers/verifyStudent.js
const Fingerprint = require("../models/Fingerprint");
const asyncWrapper = require('../middleware/async');
const e = require('express');
const Student = require("../models/Student");
const { Sequelize } = require("sequelize");
const WebSocket = require('ws');

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
  } else {
      console.log(`Client ${clientId} not connected or not found`);
  }
};


const verifyStudent = asyncWrapper(async (req, res, next) => {
    const { fingerprint_id } = req.body;

    if (fingerprint_id === undefined || fingerprint_id === null) {
        return res.status(400).json({ error: 'Fingerprint ID is required' });
    }

    try {
        // Find the student with the given fingerprint ID
        const fingerprint = await Fingerprint.findOne({ where: { id: fingerprint_id } });

        if (!fingerprint) {
            return res.status(404).json({ error: 'Student not found' });
        }

        // Return the student ID
        return res.status(200).json({ studentId: fingerprint.stu_id });
    } catch (error) {
        // Handle any errors
        console.error('Error verifying student:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

const createFingerprint = asyncWrapper(async (req, res, next) => {
    const { fingerprint_id } = req.body;
  
    if (fingerprint_id === undefined || fingerprint_id === null) {
      return res.status(400).json({ error: 'Fingerprint data is required' });
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
        return res.status(404).json({ error: 'No available student found for the fingerprint record' });
      }
  
      // Create a new fingerprint record
      const newFingerprint = await Fingerprint.create({
        id:fingerprint_id,
        stu_id: student.stu_id,
      });
  
      return res.status(201).json(newFingerprint);
    } catch (error) {
      console.error('Error creating fingerprint:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });



  const setMode = asyncWrapper(async (req, res, next) => {
    const { mode } = req.body;

    if (mode === undefined || mode === null) {
        return res.status(400).json({ error: 'Mode is required' });
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
        console.error('Error setting mode:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = { verifyStudent,createFingerprint,setWss,setMode };