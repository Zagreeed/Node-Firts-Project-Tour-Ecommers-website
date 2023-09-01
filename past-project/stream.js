const fs = require("fs");
const server = require("http").createServer();

server.on("request", (req, res) => {
  //   fs.readFile("./txt/saturday.txt", (err, data) => {
  //     if (err) console.log("ERROR");
  //     res.end(data);
  //   });

  // readable.on("data", (chunk) => {
  //   res.write(chunk);
  // });

  // readable.on("end", () => {
  //   res.end();
  // });
  const readable = fs.createReadStream("./txt/text1.txt");

  readable.pipe(res);
});

server.listen(8000, "127.0.0.1", () => {
  console.log("server listening....");
});
