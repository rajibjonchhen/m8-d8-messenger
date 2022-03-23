import express from 'express'
import {createServer} from "http"
import { Server } from 'socket.io'
import cors from 'cors'

const {PORT} = process.env
const app = express()
const server = createServer(app)
const io = new Server(server, {allowEIO3 : true})

app.use(cors())

let onlineUsers = []

io.on("connection", socket => {
    console.log(socket.id)
})

app.get("/onlineUsers", (req, res) => {
    res.send({onlineUsers})
})

server.listen(PORT, () => {
    console.log("server is running in " + PORT)
})