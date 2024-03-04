const fs = require('fs');

// *********************** SECTION 1 ******************************

// console.log("*********** How to read File synchronously ******************");
// console.log("\n");
// // **Blocking, synchronous way

// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(textIn);
// console.log("\n");
// console.log("*********** How to write a File synchronously ******************");
// console.log("\n");

// const textOut = ` This is what we know about avocado: ${textIn}.\nCreatesd on ${Date.now()}`;
// fs.writeFileSync(`./txt/output.txt`, textOut);
// console.log("File Written");

// console.log("\n");

// *********************** SECTION 2 ******************************

// console.log("*********** How to read File Asynchronously ******************");
// console.log("\n");
// // ** Non-Blocking, Asynchronous way
// fs.readFile("./txt/start.txt", "utf-8", (error, data) => {
//   console.log(data); // ? This will execute second
//   console.log("\n");
// });
// console.log("will read file"); // ? This will execute first
// console.log("\n");

// *********************** SECTION 3 ******************************

// console.log(
//   "*********** How to write and read a  File Asynchronously with Callback ******************"
// );
// console.log("\n");

// // * Lets understand call back
// console.log("*******************Call Back Hell**************");
// console.log("\n");
// fs.readFile("./txt/start.txt", "utf-8", (error, data1) => {
//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (error, data2) => {
//     console.log(data2);
//     console.log("\n");
//     fs.readFile(`./txt/append.txt`, `utf-8`, (err, data3) => {
//       console.log(data3);
//       console.log("\n");
//       fs.writeFile(`./txt/final.txt`, `${data2}\n${data3}`, "utf-8", (err) => {
//         console.log("Your file has been written😅");
//         console.log("\n");
//       });
//     });
//   });
// });

// console.log("will read file!");
// console.log("\n");

// *********************** SECTION 4 ******************************

const http = require('http');
const path = require('path');
const url = require('url');

const replaceTemplate = require('./modules/replaceTemplate');

// Below code exectes only once so it will not halt the operation continously.

const tempOverview = fs.readFileSync(
  // __dirname better practive instead of just '.'
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);

// Reading a data from the JSON
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');

const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  // ************>>>>>>  OVERVIEW PAGE <<<<<<<<<<<<<<<<<<<<<<<<<<< ----------------

  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'Content-type': 'text/html' });

    const cardsHtml = dataObj.map((e) => replaceTemplate(tempCard, e)).join('');

    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);

    res.end(output);
  }

  // ************>>>>>>  PRODUCT PAGE
  else if (pathname === '/product') {
    const product = dataObj[query.id];

    res.writeHead(200, { 'Content-type': 'text/html' });

    const output = replaceTemplate(tempProduct, product);
    res.end(output);
  }

  // ************>>>>>>  API <<<<<<<<<<<<<<<<<<<<<<<<<<<----------------------------
  else if (pathname === '/api') {
    // Below code executes again and again hence calling api synchronously
    // fs.readFile(`${__dirname}/dev-data/data.json`, "utf-8", (err, data) => {
    //   const productData = JSON.parse(data);
    res.writeHead(200, { 'Content-type': 'application/json' });

    res.end(data);
  }

  // ************>>>>>>  PAGE NOT FOUND   <<<<<<<<<<<<<<<<<<<<<<<<<< -------------------
  else {
    res.writeHead(404, {
      'content-type': 'text/html',
      'my-own-header': 'Hello World',
    });
    res.end(`<h1>Page not Found!</h1>`);
  }
});

server.listen(8000, `127.0.0.1`, () => {
  console.log('Listing to request on port 8000');
});

// *********************** SECTION 5 ******************************
