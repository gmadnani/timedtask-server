import admin from '../config/firebaseConfig.js'

class AuthCheck{
    async decodeToken(req, res, next){
        const token = req.headers.authorization.split(' ')[1]
        try{
            const decodeValue = await admin.auth().verifyIdToken(token)
            if(decodeValue && decodeValue !== undefined){
                req.user = decodeValue
                return next()
            }
            return res.json({message: "Unauthorized"})
        }catch(e){
            return res.json({message: "Internal Error", error: e.message})
        }
    }
}

export default new AuthCheck()