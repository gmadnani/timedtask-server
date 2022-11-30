import admin from 'firebase-admin';
//import serviceAccount from "./serviceAccountKey.json" assert {type: 'json'};

admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.SERVICE_ACCOUNT)) 
})

export default admin