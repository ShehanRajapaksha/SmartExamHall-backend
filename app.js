const express = require('express')
const cors = require('cors');
const app = express()
const students = require('./routes/students')
const sequelize = require('./db/connect');
const Student = require('./models/Student');
const erroHandlerMiddleware = require('./middleware/errorHandler')



app.use(express.json())
app.use(cors());

app.use('/api/v1/students',students)
app.use(erroHandlerMiddleware)

const port = 5000



const start = async () => {
    
try {
       await sequelize.sync({force:false})
       console.log("Database synchronized");
        app.listen(port, () => {
            console.log(`listening on port ${port}`);
           
            
        })
} catch (error) {
    console.log(error);
}
}

start()