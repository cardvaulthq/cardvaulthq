
import express from "express";
import { prisma } from "../config/db.js";
const router = express.Router();

// Admin: view all cards
router.get("/cards", async (req, res) => {
  const cards = await prisma.giftCard.findMany({
    include: { owner: true },
  });
  res.json(cards);
});

// Admin: forward/recover card to a user
router.post("/restore-card", async (req, res) => {
  const { cardId, userId } = req.body;
  const card = await prisma.giftCard.update({
    where: { id: cardId },
    data: {
      ownerId: userId,
      status: "RECOVERED",
    },
  });
  res.json({ success: true, card });
});

export default router;
