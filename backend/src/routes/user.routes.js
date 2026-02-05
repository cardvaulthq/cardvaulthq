import express from "express";
import { prisma } from "../config/db.js";
const router = express.Router();

// Get wallet balances
router.get("/wallet/:userId", async (req, res) => {
  const { userId } = req.params;
  let wallet = await prisma.wallet.findUnique({ where: { userId } });
  if (!wallet) {
    wallet = await prisma.wallet.create({ data: { userId } });
  }
  res.json(wallet);
});

// Withdraw funds
router.post("/wallet/withdraw", async (req, res) => {
  const { userId, amount, method, accountInfo } = req.body;

  // Fetch wallet
  const wallet = await prisma.wallet.findUnique({ where: { userId } });
  if (!wallet) return res.status(404).json({ error: "Wallet not found" });

  if (amount > wallet.mainBalance)
    return res.status(400).json({ error: "Insufficient funds" });

  // Deduct balance
  const updatedWallet = await prisma.wallet.update({
    where: { userId },
    data: {
      mainBalance: wallet.mainBalance - amount,
      pendingBalance: wallet.pendingBalance + amount
    },
  });

  // Record withdrawal request
  const withdrawal = await prisma.withdrawal.create({
    data: {
      userId,
      amount,
      method,
      accountInfo,
      status: "PENDING"
    }
  });

  res.json({ success: true, wallet: updatedWallet, withdrawal });
});

export default router;
