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

io.on("connect", socket => {
    console.log(socket.id)

    socket.on("setUsername", ({username, room}) => {
        console.log("username -" + username)
        // user = {...user, id: uuid(), createdAt: new Date()}
        console.log(room)
        onlineUsers =
        onlineUsers.filter(user => user.username !== username)
        .concat({
            username,
            id: socket.id,
            sendAt : new Date(),
            room
        })

        console.log("socket.id", socket.id , "room", room)
        socket.join(room)

        socket.emit("loggedin")
    
        socket.broadcast.emit("newConnection")
    })


    
    
    socket.on("sendmessage", ({message, room}) => {
        console.log("message - " + message)
       socket.to(room).emit("message",message)
        // socket.broadcast.emit("message",message)


    })
    
    socket.on("openChatWith", ({ recipientId, sender }) => {
        console.log("here")
        socket.join(recipientId)
        socket.to(recipientId).emit("message", { sender, text: "Hello, I'd like to chat with you" })
    })
    
    socket.on("disconnect", () => {
        console.log("Disconnected socket with id " + socket.id)
    
        onlineUsers = onlineUsers.filter(user => user.id !== socket.id)
    
        socket.broadcast.emit("newConnection")
    })
})




app.get("/online-users", (req, res) => {
    res.send({onlineUsers})
    
})

server.listen(PORT, () => {
    console.log("server is running in " + PORT)
})