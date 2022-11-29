import express from 'express';
import cors from 'cors'
import AuthCheck from './security/AuthCheck.js'
import addTaskToFirestore, {getTasksCount, readTasksFromFirestore, readTasksByDateFromFirestore, updateTaskInFirestore, logTimeInFirestore, deleteTaskFromFirestore, getTaskFromFirestore, getDailyLogs,getMonthlyLogs, getYearlyLogs} from './FirestoreUtils.js'

const app = express()
const port = process.env.PORT || 4000

app.use(cors())
app.use(AuthCheck.decodeToken)
app.use(express.json())

app.get('/', (req, res) =>{
    return res.send("Server Running")
})

app.get('/api/getusermeta', (req, res) =>{
    //console.log(req.user)
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
        taskTitle: req.body.taskTitle,
        taskCategory: req.body.taskCategory,
        taskKeywords: req.body.taskKeywords,
        taskTimer: req.body.taskTimer,
        taskRevisionDate: req.body.taskRevisionDate
    }
    addTaskToFirestore(taskToCreate)
    return res.send('Ok')
})

app.post('/api/updateTask', (req, res) =>{
    const taskToUpdate = req.body
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
    const userId = req.query.userId
    const taskList = await readTasksFromFirestore(userId)
    return res.send(taskList)
})

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