const fs = require('fs');
const http = require('http');
const url = require('url');
const replaceTemplate = require('./modules/replaceTemplate');
const slugify = require('slugify');
// const textInput = fs.readFileSync("./txt/input.txt", "utf-8");

// console.log(textInput);

// const textOut = `This is what we know about the avacado: ${textInput}.\n Created at : ${Date.now()}`;
// fs.writeFileSync("./txt/outFile.txt", textOut);

// console.log(fs.readFileSync("./txt/outFile.txt", "utf-8"));

// fs.readFile("./txt/start.txt", "utf-8", (err, data) => {
//   if (err) return console.log("ERROR!");
//   fs.readFile(`./txt/${data}.txt`, "utf-8", (err, data2) => {
//     console.log(data2);
//     fs.readFile("./txt/append.txt", "utf-8", (err, data3) => {
//       console.log(data3);
//       fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, "utf-8", (err) => {
//         console.log("File has been written");
//       });
//     });
//   });
// });
// console.log("Will read file!");

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const overView = fs.readFileSync(
  `${__dirname}/templates/overview.html`,
  'utf-8'
);
const card = fs.readFileSync(`${__dirname}/templates/card.html`, 'utf-8');
const singleProduct = fs.readFileSync(
  `${__dirname}/templates/product.html`,
  'utf-8'
);
const dataObject = JSON.parse(data);
const slugs = dataObject.map((el) => slugify(el.productName, { lower: true }));
const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);
  if (pathname === '/' || pathname === '/overview') {
    const cardsHTML = dataObject
      .map((el) => replaceTemplate(card, el))
      .join('');
    const output = overView.replace('{%PRODUCT_CARDS%}', cardsHTML);
    res.writeHead(200, {
      'Content-type': 'text/html',
    });
    res.end(output);
  } else if (pathname === '/product') {
    res.writeHead(200, {
      'Content-type': 'text/html',
    });
    const product = dataObject[query.id];
    const output = replaceTemplate(singleProduct, product);
    res.end(output);
  } else if (pathname === '/api') {
    res.writeHead(200, {
      'Content-type': 'application/json',
    });
    res.end(data);
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'hello World',
    });
    res.end('<h1>404 page not found!</h1>');
  }
});

server.listen('8000', '127.0.0.1', () => {
  console.log('Server has been started');
});
