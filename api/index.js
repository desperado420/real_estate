import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import userRouter from "./routes/user.js"
dotenv.config()


mongoose.connect(process.env.DB_URL)
.then(()=>(console.log("DB Connected Successfully")))
// .catch(console.log("DB Connection Failed"))

const app = express()

app.listen(4000, ()=>{
    console.log("Server is running on port 4000")
})

// Below para is the basic way of API Routing
app.get('/test', (req,res)=>{
    res.json({
        name:"Vinay",
        success:true
    })
})

// Below para is the advanced way of API

app.use("/api/user", userRouter)