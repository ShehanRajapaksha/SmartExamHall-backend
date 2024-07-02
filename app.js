const express = require('express');
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');

const fingerprints = require('./routes/fingerprints');
const students = require('./routes/students');
const exams = require('./routes/exams');
const admins = require('./routes/admins');
const attendence = require('./routes/attendence');

const sequelize = require('./db/connect');

const erroHandlerMiddleware = require('./middleware/errorHandler');
const authenticateToken = require('./middleware/authMiddleware');

const WebSocket = require('ws');
const { setWss } = require('./controllers/fingerprints');
const { pcAssignHandler, pcDeleteHandler } = require('./utils/clientHandlers');
const { Student, Exam, Attendence, Fingerprint, PC } = require('./models/associations'); // Ensure correct import

const server = require('http').createServer(app);
const wss = new WebSocket.Server({ server: server });
const clients = new Map();

// WebSocket Definitions
wss.on('connection', function connection(ws) {
    console.log('New Client Connected');

    ws.on('message', function incoming(msg) {
        const receivedMessage = msg.toString().trim();
        console.log('received:', receivedMessage);
        const pattern = /^(fp|pc|ad)[1-3]$/;
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
    });

    ws.on('close', async () => {
        // Remove the client from the Map when disconnected
        for (let [clientId, client] of clients.entries()) {
            if (client === ws) {
                const del = await pcDeleteHandler(clientId);
                if (del) {
                    const client = clients.get(clientId);
                    if (client && client.readyState === WebSocket.OPEN) {
                        client.send(`Your PC has lost connection id:${clientId}`);
                    }
                    clients.delete(clientId);
                    console.log(`${clientId} deleted successfully`);
                }
                console.log(`Client ${clientId} disconnected`);
                break;
            }
        }
    });

    ws.on('error', function (error) {
        console.error('WebSocket error observed:', error);
    });
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
app.use('/api/v1/students', authenticateToken, students);
app.use('/api/v1/exams', authenticateToken, exams);


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
