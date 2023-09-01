const http = require("http");
const url = require("url");
const fs = require("fs");
const { json } = require("stream/consumers");
// const relacetemplates = require("./modules/relacetemplates");

// const slugify = require("slugify");

// const templateOverview = fs.readFileSync(`${__dirname}/overview.html`, "utf-8");
// const cardTemp = fs.readFileSync(`${__dirname}/template-card.html`, "utf-8");
// const productTemp = fs.readFileSync(`${__dirname}/product.html`, "utf-8");
// const data = fs.readFileSync(`${__dirname}/data.json`, "utf-8");
// const mainData = JSON.parse(data);

// const sluggg = mainData.map((ell) => slugify(ell.productName, { lower: true }));
// console.log(sluggg);
// const server = http.createServer((req, res) => {
//   const { query, pathname } = url.parse(req.url, true);
//   console.log(pathname);
//   console.log(query);

//   // const { query, pathname } = url.parse(req.url, true);
//   // console.log(query);

//   // console.log(query);

//   if (pathname === "/" || pathname === "/overview") {
//     res.writeHead(200, {
//       "Content-type": "text/html",
//     });

//     const cardsHtml = mainData
//       .map((ell) => relacetemplates(cardTemp, ell))
//       .join("");
//     const output = templateOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);

//     res.end(output);
//   } else if (pathname === "/product") {
//     res.writeHead(200, {
//       "Content-type": "text/html",
//     });

//     const producttt = mainData[query.id];
//     const output = relacetemplates(productTemp, producttt);

//     res.end(output);
//   } else {
//     res.end("PAGE NOT FOUND");
//   }
// });

// server.listen(8000, "127.0.0.1", () => {
//   console.log("server has started");
// });

const crypto = require("crypto");
const now = Date.now();

setTimeout(() => console.log("im set-time-out"), 0);
setImmediate(() => console.log("im set-immediate"));

fs.readFile("./txt/saturdat.txt", () => {
  console.log("im read file");
  setTimeout(() => console.log("im set-time-out1"), 0);
  setTimeout(() => console.log("im set-time-out3"), 3000);
  setImmediate(() => console.log("im set-immediate2"));

  process.nextTick(() => console.log("im next tick"));

  crypto.pbkdf2("danley122121", "salt", 100000, 1024, "sha512", () => {
    console.log(Date.now() - now, "Name Encripted");
  });
  crypto.pbkdf2("danley122121", "salt", 100000, 1024, "sha512", () => {
    console.log(Date.now() - now, "Name Encripted");
  });
  crypto.pbkdf2("danley122121", "salt", 100000, 1024, "sha512", () => {
    console.log(Date.now() - now, "Name Encripted");
  });
  crypto.pbkdf2("danley122121", "salt", 100000, 1024, "sha512", () => {
    console.log(Date.now() - now, "Name Encripted");
  });
  crypto.pbkdf2("danley122121", "salt", 100000, 1024, "sha512", () => {
    console.log(Date.now() - now, "Name Encripted");
  });
});

console.log("im cosole.log");
