import express, { Request, Response } from "express";
import Runs from "../services/run-svc";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId as string;
    const runs = await Runs.index(userId);
    return res.json(runs);
  } catch (err: any) {
    console.error("GET /api/runs error:", err);
    return res.status(500).json({ error: err.message });
  }
});

router.get("/limited", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId as string;
    const runs = await Runs.indexLimited(userId);
    return res.json(runs);
  } catch (err: any) {
    console.error("GET /api/runs/dates error:", err);
    return res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId as string;
    const run = await Runs.get(req.params.id, userId);
    if (!run) {
      return res.status(404).send("Run not found");
    }
    return res.json(run);
  } catch (err: any) {
    console.error(`GET /api/runs/${req.params.id} error:`, err);
    return res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId as string;
    if (!req.body.began) {
      return res.status(400).send("began is required");
    }
    const created = await Runs.create(userId, req.body);
    return res.status(201).json(created);
  } catch (err: any) {
    console.error("POST /api/runs error:", err);
    return res.status(400).json({ error: err.message });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId as string;
    const updated = await Runs.update(req.params.id, userId, req.body);
    return res.json(updated);
  } catch (err: any) {
    console.error(`PUT /api/runs/${req.params.id} error:`, err);
    if (err?.message === "Forbidden") return res.status(403).send("Forbidden");
    if (typeof err === "string" && err.includes("not found")) {
      return res.status(404).json({ error: err });
    }
    return res.status(500).json({ error: err.message || err });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId as string;
    await Runs.remove(req.params.id, userId);
    return res.status(204).end();
  } catch (err: any) {
    console.error(`DELETE /api/runs/${req.params.id} error:`, err);
    if (typeof err === "string" && err.includes("not found")) {
      return res.status(404).json({ error: err });
    }
    return res.status(500).json({ error: err.message });
  }
});

export default router;
