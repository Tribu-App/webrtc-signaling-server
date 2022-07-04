"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const ws_1 = __importDefault(require("ws"));
const server = (0, http_1.createServer)((req, res) => {
    res.writeHead(200);
    res.end("What are you doing here?");
});
const wss = new ws_1.default.Server({ server });
const userConnectionMap = new Map();
wss.on("connection", (ws, req) => {
    const userId = req.url.slice(5);
    userConnectionMap.set(userId, ws);
    ws.on("close", function close() {
        userConnectionMap.delete(userId);
    }); // retrieve socket
    ws.on("message", onMessage);
    console.log(`connection initiated for ${userId}`);
});
const onMessage = (jsonMessage) => {
    const message = JSON.parse(jsonMessage);
    if (userConnectionMap.has(message.forUserId)) {
        const ws = userConnectionMap.get(message.forUserId);
        ws.send(JSON.stringify(message));
    }
};
module.exports = server.listen(process.env.PORT || 8080, () => console.log("server started"));
