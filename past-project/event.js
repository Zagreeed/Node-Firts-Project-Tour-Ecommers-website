const eventEmeter = require("events");
const http = require("http");
class Sales extends eventEmeter {
  constructor() {
    super();
  }
}
// const myEmitter = new Sales();

// myEmitter.on("saless", () => {
//   console.log("someone buyy boyss");
// });
// myEmitter.on("saless", () => {
//   console.log("someone buyy boyss 2");
// });
// myEmitter.on("saless", (num) => {
//   console.log(
//     `someone buy and there are ${
//       num >= 10 ? "more than 10 left" : "less than 10 left"
//     }`
//   );
// });

// myEmitter.emit("saless", 7);

const server = http.createServer();
server.on("request", (req, res) => {
  console.log("request received");
  res.end("request received");
});

server.on("request", (req, res) => {
  console.log("another request received");
});
server.on("close", () => {
  console.log("server closed");
});

server.listen(8000, "127.0.0.1", () => {
  console.log("server started");
});
