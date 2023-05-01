const https = require('https');
const fs = require('fs');

const options = {
  host: '10.10.25.130',
  port: 3000,
  path: '/api/auth',
  method: 'GET',
  cert: fs.readFileSync('./server_certs/grant.dell.com.crt'),
};

https.request(options, function(res) {
  console.log('statusCode:', res.statusCode);
  console.log('headers:', res.headers);

  res.on('data', function(d) {
    process.stdout.write(d);
  });
}).end();