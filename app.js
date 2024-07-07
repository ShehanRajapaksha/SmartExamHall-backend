const express = require('express');
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');

const fingerprints = require('./routes/fingerprints');
const students = require('./routes/students');
const exams = require('./routes/exams');
const admins = require('./routes/admins');
const attendence = require('./routes/attendence');
const pcs = require('./routes/pcs');

const sequelize = require('./db/connect');

const erroHandlerMiddleware = require('./middleware/errorHandler');
const authenticateToken = require('./middleware/authMiddleware');

const WebSocket = require('ws');
const { setWss } = require('./controllers/fingerprints');
const { pcAssignHandler, pcDeleteHandler } = require('./utils/clientHandlers');
const { Student, Exam, Attendence, Fingerprint, PC } = require('./models/associations'); // Ensure correct import
const { startExam } = require('./controllers/exams');

const server = require('http').createServer(app);
const wss = new WebSocket.Server({ server: server });
const clients = new Map();

const HEARTBEAT_INTERVAL = 30000; // 30 seconds
const HEARTBEAT_TIMEOUT = 5000; // 5 seconds

function noop() { }

function heartbeat() {
    this.isAlive = true;
}


function isJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

// WebSocket Definitions
wss.on('connection', function connection(ws) {
    console.log('New Client Connected');
    ws.isAlive = true;
    ws.on('pong', heartbeat);

    ws.on('message', function incoming(msg) {
        try {
            const receivedMessage = msg.toString().trim();
            console.log('received:', receivedMessage);
            if (isJsonString(receivedMessage)) {
                const parsedMessage = JSON.parse(receivedMessage);

                // Check if the message has a 'type' attribute
                if (parsedMessage.type === 'register' && parsedMessage.pc_name) {
                    const pcName = parsedMessage.pc_name;
                    clients.set(pcName, ws);
                    console.log(`Registering PC with name: ${pcName}`);
                    pcAssignHandler(pcName, ws);
                }
            }

            const pattern = /^(fp|pc|ad)0?[1-9][0-9]?$/;
            if (pattern.test(receivedMessage)) {
                const clientId = receivedMessage; // Assign the received message as the client ID
                clients.set(clientId, ws);
                console.log(`Assigned client ID: ${clientId}`);
                if (clientId.startsWith('pc')) {
                    pcAssignHandler(clientId, ws);
                }
            } else {
                console.log(`Received message: ${receivedMessage}`);
            }
        } catch (error) {
            console.error('Error processing message:', error);
        }
    });

    ws.on('close', async () => {
        try {
            // Remove the client from the Map when disconnected
            for (let [clientId, client] of clients.entries()) {
                if (client === ws) {
                    const del = await pcDeleteHandler(clientId);
                    if (del) {
                        clients.delete(clientId);
                        console.log(`${clientId} deleted successfully from the database`);
                    }
                    console.log(`Client ${clientId} disconnected`);
                    break;
                }
            }
        } catch (error) {
            console.error('Error during disconnection:', error);
        }
    });

    ws.on('error', function (error) {
        console.error('WebSocket error observed:', error);
    });
});

// Ping clients at regular intervals to ensure connection is alive
const interval = setInterval(() => {
    wss.clients.forEach((ws) => {
        // Only perform heartbeat for clients with IDs starting with 'pc'
        for (let [clientId, client] of clients.entries()) {
            if (client === ws && clientId.startsWith('pc')) {
                if (ws.isAlive === false) {
                    return ws.terminate();
                }

                ws.isAlive = false;
                ws.ping(noop);
            }
        }
    });
}, HEARTBEAT_INTERVAL);


wss.on('close', function close() {
    clearInterval(interval);
});

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000', // Adjust the origin to your frontend's URL
    credentials: true // Allow credentials to be sent with requests
}));
app.use(cookieParser());

// Apply authentication middleware selectively
app.use('/api/v1/admin', admins); // No authentication middleware for /login route
app.use('/api/v1/attendence', attendence);
app.use('/api/v1/fingerprints', fingerprints);
app.use('/api/v1/students', students);
app.use('/api/v1/exams', exams);
app.use('/api/v1/pcs',  pcs);
app.post('/startexam',  (req, res, next) => startExam(clients, req, res, next));

setWss(wss, clients);

app.use(erroHandlerMiddleware);

const port = 5000;

const start = async () => {
    try {
        await sequelize.sync({ force: false });
        console.log("Database synchronized");
        server.listen(port, () => {
            console.log(`Server and socket listening on port ${port}`);
        });
    } catch (error) {
        console.log(error);
    }
};

start();
