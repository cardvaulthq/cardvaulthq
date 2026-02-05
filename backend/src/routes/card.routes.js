import express from "express";
import { prisma } from "../config/db.js";
const router = express.Router();

// Upload Gift Card
router.post("/upload", async (req, res) => {
  try {
    const { type, value, currency, country, ownerId, scratchedByUser } = req.body;
    const frontImage = req.files.frontImage[0].path;
    const backImage = req.files.backImage[0].path;

    if (!scratchedByUser) {
      return res.status(400).json({ error: "User must confirm manual scratch" });
    }

    // Digital scratch simulation (placeholder)
    const scratchCode = "EXTRACTED_CODE";

    const card = await prisma.giftCard.create({
      data: {
        type,
        value,
        currency,
        country,
        frontImage,
        backImage,
        scratchCode,
        scratchedByUser: true,
        scratchedByApp: true,
        ownerId,
        storedInAdmin: true, // Admin vault mirror
        status: "PENDING",
      },
    });

    res.json({ success: true, card });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Buy a gift card
router.post("/buy", async (req, res) => {
  try {
    const { cardId, buyerId, paymentAmount, paymentMethod } = req.body;

    // Fetch card info
    const card = await prisma.giftCard.findUnique({ where: { id: cardId } });

    if (!card) return res.status(404).json({ error: "Card not found" });
    if (card.status !== "PENDING") return res.status(400).json({ error: "Card not available" });

    // Check payment (placeholder logic)
    // In real app → integrate Stripe / Paystack / USDT wallet
    if (paymentAmount < card.value) return res.status(400).json({ error: "Insufficient payment" });

    // Mark card as sold
    const updatedCard = await prisma.giftCard.update({
      where: { id: cardId },
      data: {
        status: "SOLD",
        buyerId: buyerId,
        soldAt: new Date(),
      },
    });

    // Add card to buyer's internal vault
    await prisma.userVault.create({
      data: {
        userId: buyerId,
        cardId: cardId,
      },
    });

    res.json({
      success: true,
      message: "Payment received. Card unlocked.",
      card: {
        type: updatedCard.type,
        value: updatedCard.value,
        currency: updatedCard.currency,
        frontImage: updatedCard.frontImage,
        backImage: updatedCard.backImage,
        scratchCode: updatedCard.scratchCode,
      },
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
export default router;
