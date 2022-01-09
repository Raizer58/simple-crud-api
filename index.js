
const http = require('http');
const { v4, validate } = require('uuid');
const { createReadStream, readFileSync, writeFileSync } = require('fs');

const { PERSON } = require('./src/constants/path');

const server = http.createServer((req, res) => {
  const isLiquidURL = req.url.includes(PERSON);
  const userId = isLiquidURL && req.url.replace(PERSON + '/', '');
  const isNumberFormatId = (typeof userId === 'number' && !Number.isNaN(userId)) || validate(userId);

  if (isLiquidURL && req.method === 'GET') {
    if (isNumberFormatId) {
      createReadStream('./data_BD.txt')
        .on('data', (chunk) => {
          const userInfo = JSON.parse(chunk)[userId];

          if (userInfo) {
            res.writeHead(200, {
              'Content-Type': 'application/json',
            }); 
            res.end(JSON.stringify(userInfo)); 
          } else {
            res.writeHead(404); 
            res.end(); 
          }
        });
    } else {
      createReadStream('./data_BD.txt')
        .on('data', (chunk) => {

          res.writeHead(200, {
            'Content-Type': 'application/json',
          }); 
          res.end(JSON.stringify(JSON.parse(chunk))); 
        });
    }
  } else if (isLiquidURL && req.method === 'POST') {
    const chunks = [];

    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => {
      const data = JSON.parse(Buffer.concat(chunks));
      const userId = v4();

      data.id = userId;

      const currentData = JSON.parse(readFileSync('./data_BD.txt'));
      const newData = {
        ...currentData,
        [userId]: {
          ...data,
        },
      };
      writeFileSync('./data_BD.txt', JSON.stringify(newData));

      res.writeHead(202); 
      res.end(); 
    })    
  } else if (isLiquidURL && isNumberFormatId && req.method === 'PUT') {
    const chunks = [];

    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => {
      const currentData = JSON.parse(readFileSync('./data_BD.txt'));
      const isValidUserId = Boolean(Object.keys(currentData).find((v) => String(v) === String(userId)));

      if (!isValidUserId) {
        res.writeHead(404); 
        res.end(); 

        return;
      }

      const data = JSON.parse(Buffer.concat(chunks));

      const newData = {
        ...currentData,
        [userId]: {
          ...currentData[userId],
          ...data,
        },
      };

      writeFileSync('./data_BD.txt', JSON.stringify(newData));

      res.writeHead(202); 
      res.end(); 
    }) 
  } else if (isLiquidURL && isNumberFormatId && req.method === 'DELETE') {
    const data = JSON.parse(readFileSync('./data_BD.txt'));
    const isValidUserId = Boolean(Object.keys(data).find((v) => String(v) === String(userId)));
    
    if (!isValidUserId) {
      res.writeHead(404); 
      res.end(); 

      return;
    }

    const { [userId]: deleteUserId, ...newData} = data;

    writeFileSync('./data_BD.txt', JSON.stringify(newData));

    res.writeHead(202); 
    res.end(); 
  } else {
    res.writeHead(400); 
    res.end();
  }
});

server.listen(9000);
