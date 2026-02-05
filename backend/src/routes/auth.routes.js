import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../config/db.js";
import { JWT_SECRET } from "../config/auth.js";

const router = express.Router();

/**
 * REGISTER
 */
router.post("/register", async (req, res) => {
  try {
    const { fullName, username, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        fullName,
        username,
        email,
        passwordHash: hashedPassword,
        role: "USER"
      }
    });

    res.status(201).json({ message: "User created", userId: user.id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * LOGIN
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

import express from "express";
import { prisma } from "../config/db.js";
const router = express.Router();

// Return challenge for WebAuthn
router.get("/biometric-challenge", async (req, res) => {
  const { email } = req.query;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ error: "User not found" });

  // Server generates a challenge for the client (WebAuthn)
  const challenge = {
    challenge: new Uint8Array(32),
    timeout: 60000,
    allowCredentials: [], // Fill with registered credentials later
    userVerification: "preferred"
  };

  res.json(challenge);
});

// Verify biometric login
router.post("/biometric-verify", async (req, res) => {
  const { credential } = req.body;
  // TODO: Verify with WebAuthn server-side logic
  // For MVP, assume always successful
  res.json({ success: true });
});

export default router;
