import User from "../models/user.js"
import bcryptjs from "bcryptjs"

export const signup = async(req,res) => {
    const {username, email, password} = req.body

    const hashedPassword = bcryptjs.hashSync(password,10)
    try{
        
        const newUser = new User({username, email, password:hashedPassword})
        await newUser.save() 
        console.log(newUser)
        /*
        Since the result from DataBase takes some amount of time
        we do not want to jump off the next function
        we use the keyword of 'await' infront of DB command.
        Now that we have used await keyword in our codebase
        we have violated the regular synchronous feature
        by keeping manual hold over a single command
        we must declare our function as asynchronous 
        by using the 'async' keyword.
        */
        res.status(201).json({
            success:true,
            message:"User created successfully"
        })
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }

}