const express = require('express');
const cors = require('cors');
const app = express();
const students = require('./routes/students');
const sequelize = require('./db/connect');
const erroHandlerMiddleware = require('./middleware/errorHandler');
const fingerprints = require('./routes/fingerprints');
const WebSocket = require('ws');
const { setWss } = require('./controllers/fingerprints');

const server = require('http').createServer(app);
const wss = new WebSocket.Server({ server: server });
const clients = new Map();


wss.on('connection', function connection(ws) {
    console.log('New Client Connected');
    

    ws.on('message', function incoming(msg) {
        const receivedMessage = msg.toString().trim();
        console.log('received:', receivedMessage);
        const pattern = /^(fp|pc|ad)[1-3]$/;
        if (pattern.test(receivedMessage)) {
            // Assign the received message as the client ID
            const clientId = receivedMessage;
            clients.set(clientId, ws);
            // console.log("assigning");
            console.log(`Assigned client ID: ${clientId}`);
        } else {
            console.log(`Received message: ${receivedMessage}`);
        }
    });

    ws.on('close', () => {
        // Remove the client from the Map when disconnected
        for (let [clientId, client] of clients.entries()) {
            if (client === ws) {
                clients.delete(clientId);
                console.log(`Client ${clientId} disconnected`);
                break;
            }
        }
    });

    ws.on('error', function(error) {
        console.error('WebSocket error observed:', error);
    });
});

// Log message indicating WebSocket server is started
// console.log('WebSocket server is running');

app.use(express.json());
app.use(cors());

app.use('/api/v1/students', students);

setWss(wss, clients);
app.use('/api/v1/fingerprints', fingerprints);
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
