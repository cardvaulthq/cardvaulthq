import express from "express";
import { prisma } from "../config/db.js";
import { broadcastTrade } from "../sockets/trades.js";
const router = express.Router();

// Get all trades
router.get("/trades", async (req, res) => {
  const trades = await prisma.trade.findMany({
    orderBy: { createdAt: "desc" },
  });
  res.json(trades);
});

// Get all users with IP/device tracking
router.get("/users", async (req, res) => {
  const users = await prisma.user.findMany({
    select: { id: true, username: true, lastIP: true, lastDevice: true }
  });
  res.json(users);
});

// Restore lost card to a user
router.post("/restore-card", async (req, res) => {
  const { cardId, userId } = req.body;
  const card = await prisma.giftCard.update({
    where: { id: cardId },
    data: {
      ownerId: userId,
      status: "RECOVERED",
      storedInAdmin: true,
    },
  });
  res.json({ success: true, card });
});

// Pause/Resume Buy or Sell
router.post("/pause-mode", async (req, res) => {
  const { mode, action } = req.body; // mode = "buy"|"sell", action = "pause"|"resume"
  const updated = await prisma.platformControl.upsert({
    where: { mode },
    update: { status: action === "pause" ? "PAUSED" : "ACTIVE" },
    create: { mode, status: action === "pause" ? "PAUSED" : "ACTIVE" }
  });
  res.json(updated);
});

// Override card rate
router.post("/override-rate", async (req, res) => {
  const { cardType, newRate } = req.body;
  const rate = await prisma.cardRate.upsert({
    where: { cardType },
    update: { rate: newRate },
    create: { cardType, rate: newRate },
  });
  res.json(rate);
});

export default router;
