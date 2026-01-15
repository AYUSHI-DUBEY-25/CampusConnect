import express from "express";
import { body, validationResult } from "express-validator";

const router = express.Router();

router.post(
  "/",
  body("email").isEmail().normalizeEmail(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ message: "Invalid email" });

    const { email } = req.body;
    try {
      return res.status(201).json({ message: "Subscribed successfully." });
    } catch (err) {
      console.error("Subscribe error:", err);
      if (err.code === 11000) return res.status(200).json({ message: "Already subscribed." });
      return res.status(500).json({ message: "Subscription failed" });
    }
  }
);
export default router;