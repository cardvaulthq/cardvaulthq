import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    // Client can request existing trades
    socket.on("requestTrades", async () => {
      const trades = await prisma.trade.findMany({
        orderBy: { createdAt: "desc" },
        take: 50
      });
      socket.emit("initialTrades", trades);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
};

export const broadcastTrade = (trade) => {
  if (io) io.emit("newTrade", trade);
};
