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

	socket.on("join-room", ({ name, room }) => {
		io.to(room).emit("new-joiner", name);
		// socket.emit("goto-room", room);
		socket.join(room);

		console.log("New joiner: ", { name, room });
	});
	socket.on("inform-joiner-about-me", ({ name, room }) => {
		console.log("inform about", name);

		socket.broadcast.to(room).emit("hi-from", name);
	});

	socket.on("leave-room", (room) => {
		socket.broadcast.to(room).emit("i-left-the-room");
		socket.leave(room);
	});

	socket.on("my-offerD", ({ offerD, room }) => {
		console.log("new offerD");
		socket.broadcast.to(room).emit("incoming-offerD", offerD);
	});
	socket.on("my-answerD", ({ answerD, room }) => {
		console.log("new answerD");
		socket.broadcast.to(room).emit("incoming-answerD", answerD);
	});

	socket.on("my-ice-candidate", ({ iceCandidate, room }) => {
		console.log("ice-candidate arrived");

		socket.broadcast.to(room).emit("incoming-ice-candidate", iceCandidate);
	});

	socket.on("disconnect", () => {
		console.log("a user disconnected", { clients: --clients });
	});
});
