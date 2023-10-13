import User from "../models/user.js"
import bcryptjs from "bcryptjs"
import {errorHandler} from "../utils/error.js"
import jwt from "jsonwebtoken"

export const signup = async(req,res,next) => {
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
        next(error)
    }

}

export const signin = async(req,res,next) => {
    const {email, password} = req.body

    try{
        const user = await User.findOne({email:email})
        if(!user){
            return next(errorHandler(404, 'User not found'))
        }

        const validPassword = bcryptjs.compareSync(password, user.password)
        if(!validPassword){
            return next(errorHandler(401, "Wrong password"))

        }

        const payload={
            id:user._id,
            email:user.email
        }
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn:"2h"
        })
        user.toObject()
        user.token=token
        user.password=undefined
        res.cookie("access_token", token, {
            httpOnly:true,
            expires:new Date(Date.now()+2*60*60*1000)
        })
        .status(200)
        .json({
            user
        })

    } catch(error){
        next(error)
    }
}