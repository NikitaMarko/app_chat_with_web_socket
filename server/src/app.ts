import express from "express";
import {createServer} from "node:http";
import {setupWebSocket} from "./ws.ts";

const PORT = 3023;
export const app = express();

const server = createServer(app);

const broadcast = setupWebSocket(server)


app.use(express.json())
app.post('/send', (req, res) => {
    const {msg} = req.body;
    if(!msg) res.status(400).send("Invalid msg");
    broadcast(`[ADMIN]:${msg}`);
    res.send('OK');
})

server.listen(PORT, ()=> console.log(`Server runs at http://localhost:${PORT}`))