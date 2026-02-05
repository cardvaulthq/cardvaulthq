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

export default router;
