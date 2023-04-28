const fs = require('fs');
const https = require('https');

// Read the CA certificate and server certificate and key from files
const caCert = fs.readFileSync('./server_certs/rootCA.crt');
const serverCert = fs.readFileSync('./server_certs/grant.dell.com.crt');
const serverKey = fs.readFileSync('./server_certs/grant.dell.com.key');

// Create options for the HTTPS server
const serverOptions = {
  ca: caCert,
  cert: serverCert,
  key: serverKey
};

// Create the HTTPS server
const server = https.createServer(serverOptions, (req, res) => {
  res.writeHead(200);
  res.end('Hello, world!');
});

// Validate client certificates on incoming requests
server.on('secureConnection', (tlsSocket) => {
  console.log('Client connected with certificate:')
  const cert = tlsSocket.getPeerCertificate();
  if (!cert || cert.issuerCertificate !== caCert) {
    tlsSocket.destroy(new Error('Invalid client certificate'));
  } else {
    console.log('Valid client certificate:');
    console.log(`Subject: ${cert.subject}`);
    console.log(`Issuer: ${cert.issuer}`);
    console.log(`Valid from: ${cert.valid_from}`);
    console.log(`Valid to: ${cert.valid_to}`);
  }
});

// Start the server listening on port 443 (HTTPS)
server.listen(443, '0.0.0.0', () => {
  console.log('Server listening on port 443');
});
