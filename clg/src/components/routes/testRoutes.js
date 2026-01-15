import express from "express";
const router = express.Router();

router.get("/hello", (req, res) => {
  res.json({ ok: true, msg: "hello from backend" });
});

export default router;
