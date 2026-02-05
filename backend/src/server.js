import express from "express";
import cardRoutes from "./routes/card.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import multer from "multer";

const app = express();
app.use(express.json());

// Multer setup for file upload
const upload = multer({ dest: "uploads/" });

// User routes (upload front + back)
app.use("/api/cards", upload.fields([
  { name: "frontImage", maxCount: 1 },
  { name: "backImage", maxCount: 1 },
]), cardRoutes);

// Admin routes
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
