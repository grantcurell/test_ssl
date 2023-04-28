// Node.js program to demonstrate the
// tlsSocket.getPeerCertificate() method

const tls = require('tls'),
	fs = require('fs'),

	// Port and host address for server
	PORT = 1337,
	HOST = '127.0.0.1',
	value = null;

// Private key and public certificate for access
const options = {
	key: fs.readFileSync('private-key.pem'),
	cert: fs.readFileSync('public-cert.pem'),
	rejectUnauthorized: false
};

// Creating and initializing server
const server = tls.createServer(options, function (socket) {

	// Print the data that we received
	socket.on('data', function (data) {
		console.log('\nReceived: %s ',
			data.toString().replace(/(\n)/gm, ""));
	});

	// Stopping the server
	// by using the close() method
	server.close(() => {
		console.log("Server closed successfully");
	});
});

// Start listening on a specific port and address
// by using listen() method
server.listen(PORT, HOST, function () {
	console.log("I'm listening at %s, on port %s", HOST, PORT);
});

// Creating and initializing client
const client = tls.connect(PORT, HOST, options, function () {

	// Getting peer certificate
	// by using tlsSocket.getPeerCertificate() method
	let value = client.getPeerCertificate(false);

	client.write("peer certificate : " + value.serialNumber);

	client.end(() => {
		console.log("Client closed successfully");
	});
});
