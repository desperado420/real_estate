import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()


mongoose.connect(process.env.DB_URL)
.then(()=>(console.log("DB Connected Successfully")))
// .catch(console.log("DB Connection Failed"))

const app = express()

app.listen(4000, ()=>{
    console.log("Server is running on port 4000")
})