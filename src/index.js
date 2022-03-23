import express from 'express'
import {createServer} from "http"
import { Server } from 'socket.io'
import cors from 'cors'
import dotenv from 'dotenv'
import { v4 as uuid } from 'uuid';


process.env.NODE_ENV !== "production" && dotenv.config()

const PORT = process.env.PORT 
const app = express()
const server = createServer(app)
const io = new Server(server, {allowEIO3 : true})

app.use(cors())

let onlineUsers = []

io.on("connection", socket => {
    console.log(socket.id)

    socket.on("login", (user) => {
        console.log("username -" + user.username)
        user = {...user, id: uuid(), createdAt: new Date()}
        console.log(user)
        onlineUsers.push(user)
    })

    socket.on("sendmessage", ({message}) => {
        console.log("message - " + message)
    })

})

app.get("/onlineUsers", (req, res) => {
    res.send({onlineUsers})
    onlineUsers.push(username)
})

server.listen(PORT, () => {
    console.log("server is running in " + PORT)
})