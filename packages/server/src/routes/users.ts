// packages/server/src/routes/users.ts

import express, { Request, Response } from "express";
import Users, { UserModel } from "../services/user-svc";

const router = express.Router();


router.get("/", async (_req: Request, res: Response) => {
  try {

    const type = (_req as any).userType;
    if (type !== "admin") {
      return res.status(403).send("Forbidden: only admins can view all users");
    }

    const allUsers = await Users.index();
    return res.json(allUsers);
  } catch (err: any) {
    console.error("GET /api/users error:", err);
    return res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/users/:id
 *  return a single user document by “id”
 *  if no user found, return 404
 */
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const username = req.params.id;

    const type = (req as any).userType;

    // JWT middleware (authenticateUser) should have set req.userId:
    if ((req as any).userId !== username && type !== "admin") {
      return res.status(403).send("Forbidden: cannot view another user's profile");
    }

    const user = await Users.get(username);
    if (!user) {
      return res.status(404).send("User not found");
    }
    return res.json(user);
  } catch (err: any) {
    console.error(`GET /api/users/${req.params.id} error:`, err);
    return res.status(500).json({ error: err.message });
  }
});


/**
 * PUT /api/users/:id
 *   replace the entire User document with req.body (the full User object)
 *   requires that (req as any).userId === req.params.id
 *   returns 403 if someone tries to update another user’s record
 *   returns 404 if no such user exists
 *   otherwise returns 200 + JSON(updatedUser)
 */
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const username = req.params.id;

    // JWT middleware (authenticateUser) should have set req.userId:
    const type = (req as any).userType;
    if ((req as any).userId !== username && type !== "admin") {
      return res.status(403).send("Forbidden: cannot edit another user");
    }

    // req.body must be the full User object (including shares, receives, name, etc.)
    const updatedFields = req.body;
    const updatedUser = await Users.update(username, updatedFields);

    if (!updatedUser) {
      return res.status(404).send("User not found");
    }

    return res.json(updatedUser);
  } catch (err: any) {
    console.error(`PUT /api/users/${req.params.id} error:`, err);
    return res.status(500).json({ error: err.message });
  }
});

/**
 * DELETE /api/users/:id
 *   remove a user from the database
 *   returns 204 on success, or 404 if no such user exists
 */
router.delete("/:id", async (req: Request, res: Response) => {
  try {

    const type = (req as any).userType;
    if (type !== "admin") {
      return res.status(403).send("Forbidden: only admins can delete users");
    }

    const username = req.params.id;
    await Users.remove(username);
    return res.status(204).end();
  } catch (err: any) {
    console.error(`DELETE /api/users/${req.params.id} error:`, err);
    return res.status(404).json({ error: err.message });
  }
});


export default router;
