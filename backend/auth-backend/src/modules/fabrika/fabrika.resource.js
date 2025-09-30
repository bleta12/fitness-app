import express from "express";
import { FabrikaService } from "./fabrika.service.js";

const router = express.Router();


router.post("/add", (req, res) => {
  FabrikaService.add(req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "✅ Fabrika inserted", id: result.insertId });
  });
});


router.get("/all", (_req, res) => {
  FabrikaService.listAll((err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});


router.get("/with-makina", (_req, res) => {
  FabrikaService.listWithMakina((err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});


router.put("/update/:id", (req, res) => {
  FabrikaService.update(req.params.id, req.body, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "✅ Fabrika updated" });
  });
});


router.delete("/delete/:id", (req, res) => {
  FabrikaService.delete(req.params.id, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "🗑️ Fabrika deleted" });
  });
});

export default router;
