import admin from './config/firebaseConfig.js'

// class FirestoreUtils{
//     firestoreDB = "Hello" //admin.firestore()

//     static addTaskToFirestore = () => {
//         //firestoreDB.collection("tasklist").doc(task)
//         console.log("Hello")
//     }
// }

// export default new FirestoreUtils.addTaskToFirestore()
// //module.exports = addTaskToFirestore

const firestoreDB = admin.firestore()

const addTaskToFirestore = (task) =>{
    firestoreDB.collection('tasklists').doc(task.userId).collection('tasks').doc(task.taskId).set(task)
    const taskCount = parseInt(task.taskId.replace('task', ''))
    firestoreDB.collection('tasklists').doc(task.userId).set({lasttaskcount: taskCount})
}

const getTasksCount = async (userId) =>{
    //const snapshot = await firestoreDB.collection('tasklists').doc(userId).collection('tasks').count().get()
    let count = 0
    const snapshott = await firestoreDB.collection('tasklists').doc(userId).get()
    if(snapshott.data() !== undefined){
        count = snapshott.data().lasttaskcount
    }
    return count
}

const readTasksFromFirestore = async(userId) =>{
    const resToSend = []
    const snapshot = await firestoreDB.collection('tasklists').doc(userId).collection('tasks').get()
    snapshot.forEach(doc => {
        resToSend.push(doc.data())
    })
    return resToSend
}

const readTasksByDateFromFirestore = async(userId, dateToFetch) =>{
    const resToSend = []
    const snapshot = await firestoreDB.collection('tasklists').doc(userId).collection('tasks').where('taskRevisionDate', '==', dateToFetch).get()
    if(snapshot.empty){
        return 'No Data'
    }else{
        snapshot.forEach(doc => {
            resToSend.push(doc.data())
        })
        return resToSend
    }
}

const updateTaskInFirestore = (task) =>{
    firestoreDB.collection('tasklists').doc(task.userId).collection('tasks').doc(task.taskId).set(task)
}

const dailyTimeLogger = async(task, timeToLog) =>{
    const snapshot = await firestoreDB.collection('tasklists')
    .doc(task.userId)
    .collection('tasks')
    .doc(task.taskId)
    .collection('timeloggeddaily')
    .doc(task.taskRevisionDate)
    .get()

    if(snapshot.data() === undefined){
        firestoreDB.collection('tasklists')
        .doc(task.userId)
        .collection('tasks')
        .doc(task.taskId)
        .collection('timeloggeddaily')
        .doc(task.taskRevisionDate)
        .set({date:task.taskRevisionDate, time:timeToLog})
    }else{
        firestoreDB.collection('tasklists')
        .doc(task.userId)
        .collection('tasks')
        .doc(task.taskId)
        .collection('timeloggeddaily')
        .doc(task.taskRevisionDate)
        .set({date:task.taskRevisionDate, time:(snapshot.data().time + timeToLog)})
    }
}

const monthlyTimeLogger = async(task, timeToLog) =>{
    const month = task.taskRevisionDate.split('-')[1]
    const year = task.taskRevisionDate.split('-')[0]
    const snapshot = await firestoreDB.collection('tasklists')
    .doc(task.userId)
    .collection('tasks')
    .doc(task.taskId)
    .collection('timeloggedmontly')
    .doc(`${year}-${month}`)
    .get()

    if(snapshot.data() === undefined){
        firestoreDB.collection('tasklists')
        .doc(task.userId)
        .collection('tasks')
        .doc(task.taskId)
        .collection('timeloggedmontly')
        .doc(`${year}-${month}`)
        .set({month:`${year}-${month}`, time:timeToLog})
    }else{
        firestoreDB.collection('tasklists')
        .doc(task.userId)
        .collection('tasks')
        .doc(task.taskId)
        .collection('timeloggedmontly')
        .doc(`${year}-${month}`)
        .set({month:`${year}-${month}`, time:(snapshot.data().time + timeToLog)})
    }
}

const yearlyTimeLogger = async(task, timeToLog) =>{
    const year = task.taskRevisionDate.split('-')[0]
    
    const snapshot = await firestoreDB.collection('tasklists')
    .doc(task.userId)
    .collection('tasks')
    .doc(task.taskId)
    .collection('timeloggedyearly')
    .doc(year)
    .get()

    if(snapshot.data() === undefined){
        firestoreDB.collection('tasklists')
        .doc(task.userId)
        .collection('tasks')
        .doc(task.taskId)
        .collection('timeloggedyearly')
        .doc(year)
        .set({year:year, time:timeToLog})
    }else{
        firestoreDB.collection('tasklists')
        .doc(task.userId)
        .collection('tasks')
        .doc(task.taskId)
        .collection('timeloggedyearly')
        .doc(year)
        .set({year:year, time:(snapshot.data().time + timeToLog)})
    }
}

const logTimeInFirestore = async(task, timeToLog) =>{
    dailyTimeLogger(task, timeToLog)
    monthlyTimeLogger(task, timeToLog)
    yearlyTimeLogger(task, timeToLog)
}

const deleteTaskFromFirestore = (task) =>{
    firestoreDB.collection('tasklists')
        .doc(task.userId)
        .collection('tasks')
        .doc(task.taskId)
        .delete()
}

const getTaskFromFirestore = async (userId, taskId) =>{
    const snapshot = await firestoreDB.collection('tasklists').doc(userId).collection('tasks').doc(taskId).get()
    if(snapshot.data() === undefined){
        return {}
    }else{
        return snapshot.data()
    }
}

const getDailyLogs = async (userId, taskId) =>{
    const snapshot = await firestoreDB.collection('tasklists').doc(userId).collection('tasks').doc(taskId).collection('timeloggeddaily').get()
    const resToSend = []
    snapshot.forEach(doc => {
        resToSend.push(doc.data())
    })
    return resToSend
}

const getMonthlyLogs = async (userId, taskId) =>{
    const snapshot = await firestoreDB.collection('tasklists').doc(userId).collection('tasks').doc(taskId).collection('timeloggedmontly').get()
    const resToSend = []
    snapshot.forEach(doc => {
        resToSend.push(doc.data())
    })
    return resToSend
}

const getYearlyLogs = async (userId, taskId) =>{
    const snapshot = await firestoreDB.collection('tasklists').doc(userId).collection('tasks').doc(taskId).collection('timeloggedyearly').get()
    const resToSend = []
    snapshot.forEach(doc => {
        resToSend.push(doc.data())
    })
    return resToSend
}

export default addTaskToFirestore
export {
    getTasksCount,
    readTasksFromFirestore,
    readTasksByDateFromFirestore,
    updateTaskInFirestore,
    logTimeInFirestore,
    deleteTaskFromFirestore,
    getTaskFromFirestore,
    getDailyLogs,
    getMonthlyLogs,
    getYearlyLogs
}