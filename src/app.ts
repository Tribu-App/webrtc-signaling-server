import { createServer } from "http";
import WebSocket from "ws";

const server = createServer((req, res) => {
  res.writeHead(200);
  res.end("What are you doing here?");
});
const wss = new WebSocket.Server({ server });

const userConnectionMap = new Map<string, WebSocket>();

wss.on("connection", (ws, req) => {
  const userId = req.url!.slice(5);
  userConnectionMap.set(userId, ws);
  ws.on("close", function close() {
    userConnectionMap.delete(userId);
  }); // retrieve socket
  ws.on("message", onMessage);
  console.log(`connection initiated for ${userId}`);
});

const onMessage = (jsonMessage: string) => {
  const message = JSON.parse(jsonMessage) as TribuMessage;
  if (userConnectionMap.has(message.forUserId)) {
    const ws = userConnectionMap.get(message.forUserId) as WebSocket;
    ws.send(JSON.stringify(message));
  }
};

module.exports = server.listen(process.env.PORT || 8080, () =>
  console.log("server started")
);

type TribuMessage = {
  forUserId: string;
  fromUserId: string;
  tribuId: string;
  data: string;
};
