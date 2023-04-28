const forge = require('node-forge');
const fs = require('fs');
const https = require('https');

// Read the CA certificate and private key from files
const caCert = fs.readFileSync('./server_certs/rootCA.pem');
const caKey = fs.readFileSync('./server_certs/rootCA.key');

// Create a certificate authority object
const ca = forge.pki.certificateFromPem(caCert);
const privateKey = forge.pki.privateKeyFromPem(caKey);

// Create a new key pair for the client certificate
const keys = forge.pki.rsa.generateKeyPair(2048);

// Create a certificate for the client
let clientCert = forge.pki.createCertificate();
clientCert.publicKey = keys.publicKey;
clientCert.serialNumber = '01';
clientCert.validity.notBefore = new Date();
clientCert.validity.notAfter = new Date();
clientCert.validity.notAfter.setFullYear(clientCert.validity.notBefore.getFullYear() + 1);
const attrs = [{
  name: 'commonName',
  value: 'example.com'
}, {
  name: 'countryName',
  value: 'US'
}, {
  shortName: 'ST',
  value: 'California'
}, {
  name: 'localityName',
  value: 'San Francisco'
}, {
  name: 'organizationName',
  value: 'Example, Inc.'
}, {
  shortName: 'OU',
  value: 'Client Certificate'
}];
clientCert.setSubject(attrs);
clientCert.setIssuer(ca.subject.attributes);
clientCert.setExtensions([{
  name: 'basicConstraints',
  cA: false
}, {
  name: 'subjectAltName',
  altNames: [{
    type: 2, // DNS name
    value: 'example.com'
  }]
}]);
clientCert.sign(privateKey, forge.md.sha256.create());

// Write the client certificate and key to files
fs.writeFileSync('./server_certs/client.crt', forge.pki.certificateToPem(clientCert));
fs.writeFileSync('./server_certs/client.key', forge.pki.privateKeyToPem(keys.privateKey));

// Read the client certificate and key from files
const clientCertFile = fs.readFileSync('./server_certs/client.crt');
const clientKeyFile = fs.readFileSync('./server_certs/client.key');
const clientCertObj = forge.pki.certificateFromPem(clientCertFile);
const clientKey = forge.pki.privateKeyFromPem(clientKeyFile);

// Create options for the HTTPS request
const requestOptions = {
  ca: caCert,
  cert: forge.pki.certificateToPem(clientCertObj),
  key: clientKeyFile,
  host: 'localhost',
  port: 443,
  path: '/',
  method: 'GET',
  rejectUnauthorized: false
};

// Make the HTTPS request
const req = https.request(requestOptions, (res) => {
  console.log('statusCode:', res.statusCode);
  console.log('headers:', res.headers);

  res.on('data', (d) => {
    process.stdout.write(d);
  });
});

req.on('error', (e) => {
  console.error(e);
});

req.end();