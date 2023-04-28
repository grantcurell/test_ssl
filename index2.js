// Node.js program to demonstrate the
// tlsSocket.getPeerCertificate() method

const tls = require('tls'),
	fs = require('fs'),

	// Port and host address for server
	PORT = 1337,
	HOST = '127.0.0.1';

// Private key and public certificate for access
const options = {
	key: fs.readFileSync('private-key.pem'),
	cert: fs.readFileSync('public-cert.pem'),
	requestCert: true,
	ca: [fs.readFileSync('client-cert.pem')],
	rejectUnauthorized: true
};

// Creating and initializing server
const server = tls.createServer(options, function (socket) {
	// do nothing here
});

server.on('secureConnection', function (socket) {
	// Getting peer certificate
	// by using tlsSocket.getPeerCertificate() method
	const value = socket.getPeerCertificate(true);
	//value['valid_from'] = value['valid_from'].toString();
	socket.write("peer certificate : " + JSON.stringify(value));

	// Stopping the server
	// by using the close() method
	server.close(() => {
		console.log("Server closed successfully")
	});
});

// Start listening on a specific port and address
// by using listen() method
server.listen(PORT, HOST, function () {
	console.log("I'm listening at %s, on port %s", HOST, PORT);
});

// Creating and initializing client
const client = tls.connect(PORT, HOST, options, function () {
	console.log("client is connected");
});

client.on("data", function (data) {

	console.log('Received: %s',
		data.toString().replace(/(\n)/gm, ""));

	// Close the connection after receiving the message
	client.end(() => {
		console.log("client closed successfully")
	});
});
