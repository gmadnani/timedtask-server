import express from 'express';
import cors from 'cors';
import AuthCheck from './security/AuthCheck.js';
import addTaskToFirestore, { getTasksCount, readTasksFromFirestore, readTasksByDateFromFirestore, updateTaskInFirestore, logTimeInFirestore, deleteTaskFromFirestore, getTaskFromFirestore, getDailyLogs, getMonthlyLogs, getYearlyLogs } from './FirestoreUtils.js';
import crypto from 'crypto';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// Rate limiting middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later'
});
app.use(limiter);

app.use(cors());
app.use(AuthCheck.decodeToken);
app.use(express.json());

// Encryption function
const encryptData = (data) => {
    const cipher = crypto.createCipheriv('aes-256-cbc', process.env.ENCRYPTION_KEY, Buffer.alloc(16));
    let encryptedData = cipher.update(data, 'utf8', 'hex');
    encryptedData += cipher.final('hex');
    return encryptedData;
};

// Decryption function
const decryptData = (encryptedData) => {
    const decipher = crypto.createDecipheriv('aes-256-cbc', process.env.ENCRYPTION_KEY, Buffer.alloc(16));
    let decryptedData = decipher.update(encryptedData, 'hex', 'utf8');
    decryptedData += decipher.final('utf8');
    return decryptedData;
};

app.get('/', (req, res) =>{
    return res.send("Server Running")
})

app.get('/api/getusermeta', (req, res) =>{
    return res.json({
        userName: req.user.name,
        userPicture: req.user.picture,
        userId: req.user.user_id,
        userEmail: req.user.email
    })
})

app.get('/api/gettaskscount', async (req, res) =>{
    const count = await getTasksCount(req.query.userId)
    res.json({count: count})
})

app.post('/api/createtasks', (req, res) => {
    const taskToCreate = {
        userId: req.body.userId,
        taskId: req.body.taskId,
        taskTitle: encryptData(req.body.taskTitle),
        taskCategory: encryptData(req.body.taskCategory),
        taskKeywords: encryptData(req.body.taskKeywords),
        taskTimer: req.body.taskTimer,
        taskRevisionDate: req.body.taskRevisionDate
    };
    addTaskToFirestore(taskToCreate);
    return res.send('Ok');
});

app.post('/api/updateTask', (req, res) =>{
    const taskToUpdate = {
        ...req.body,
        taskTitle: encryptData(req.body.taskTitle),
        taskCategory: encryptData(req.body.taskCategory),
        taskKeywords: encryptData(req.body.taskKeywords)
    };
    updateTaskInFirestore(taskToUpdate)
    return res.status(200)
})

app.post('/api/logTimeForTask', (req, res) =>{
    const task = req.body.task
    const timeToLog = req.body.timeLogger
    logTimeInFirestore(task, timeToLog)
    return res.status(200)
})

app.post('/api/deleteTask', (req, res) =>{
    const task = req.body
    deleteTaskFromFirestore(task)
    return res.status(200)
})

app.get('/api/gettasklist', async (req, res) =>{
    const userId = req.query.userId;
    const taskList = await readTasksFromFirestore(userId);
    const decryptedTaskList = taskList.map(task => ({
        ...task,
        taskTitle: decryptData(task.taskTitle),
        taskCategory: decryptData(task.taskCategory),
        taskKeywords: decryptData(task.taskKeywords)
    }));
    return res.send(decryptedTaskList);
});


app.get('/api/gettasklistfordate', async (req, res) => {
    const userId = req.query.userId
    const dateToFetch = req.query.dateForFetch
    const taskList = await readTasksByDateFromFirestore(userId, dateToFetch)
    return res.send(taskList)
})


app.get('/api/getTask', async (req, res) => {
    const userId = req.query.userId
    const taskId = req.query.taskId
    const task = await getTaskFromFirestore(userId, taskId)
    
    // Decrypt task data
    task.taskTitle = decryptData(task.taskTitle);
    task.taskCategory = decryptData(task.taskCategory);
    task.taskKeywords = decryptData(task.taskKeywords);
    
    return res.send(task)
})

app.get('/api/getDailyLogs', async (req, res) => {
    const userId = req.query.userId
    const taskId = req.query.taskId
    const task = await getDailyLogs(userId, taskId)
    return res.send(task)
})

app.get('/api/getMonthlyLogs', async (req, res) => {
    const userId = req.query.userId
    const taskId = req.query.taskId
    const task = await getMonthlyLogs(userId, taskId)
    return res.send(task)
})

app.get('/api/getYearlyLogs', async (req, res) => {
    const userId = req.query.userId
    const taskId = req.query.taskId
    const task = await getYearlyLogs(userId, taskId)
    return res.send(task)
})

app.listen(port, ()=>{
    console.log(`Server running on ${port}`)
})