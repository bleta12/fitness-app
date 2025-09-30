import express from "express";
import { MakinaService } from "./makina.service.js";

const router = express.Router();


router.post("/add", (req, res) => {
  MakinaService.add(req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "✅ Makina inserted", id: result.insertId });
  });
});


router.get("/all", (_req, res) => {
  MakinaService.listAll((err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});


router.get("/by-fabrika/:id", (req, res) => {
  MakinaService.listByFabrika(req.params.id, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});


router.put("/update/:id", (req, res) => {
  MakinaService.update(req.params.id, req.body, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "✅ Makina updated" });
  });
});


router.delete("/delete/:id", (req, res) => {
  MakinaService.delete(req.params.id, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "🗑️ Makina deleted" });
  });
});

export default router;
