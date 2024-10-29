import { Server } from "socket.io";

const PORT = 3000;
const io = new Server({
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
	},
});
io.listen(PORT);
console.log(`Socket is running on: ${PORT}`);

let clients = 0;

io.on("connection", (socket) => {
	clients++;

	console.log("new connection", { clients });

	socket.on("join-room", ({ USER, room }) => {
		io.to(room).emit("new-joiner", USER);
		// socket.emit("goto-room", room);
		socket.join(room);

		// console.log("New joiner: ", { USER, room });
	});
	socket.on("inform-joiner-about-me", ({ USER, room }) => {
		// console.log("inform about", USER);

		socket.broadcast.to(room).emit("hi-from", USER);
	});

	socket.on("my-offerD", ({ offerD, room }) => {
		// console.log("new offerD");
		socket.broadcast.to(room).emit("incoming-offerD", offerD);
	});
	socket.on("my-answerD", ({ answerD, room }) => {
		// console.log("new answerD");
		socket.broadcast.to(room).emit("incoming-answerD", answerD);
	});

	socket.on("my-ice-candidate", ({ iceCandidate, room }) => {
		// console.log("ice-candidate arrived");

		socket.broadcast.to(room).emit("incoming-ice-candidate", iceCandidate);
	});

	socket.on("disconnect", () => {
		console.log("a user disconnected", { clients: --clients });
	});
});
