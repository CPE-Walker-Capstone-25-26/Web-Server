// packages/server/src/routes/auth.ts

import dotenv from "dotenv";
import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import credentials  from "../services/credential-svc";
import Users from "../services/user-svc";

dotenv.config();
const TOKEN_SECRET = process.env.TOKEN_SECRET || "NOT_A_SECRET";

const router = express.Router();


export function authenticateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.method === "OPTIONS") {
    return next();
  }

  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];
  if (!token) {
    return res.status(401).end();
  }

  jwt.verify(token, TOKEN_SECRET, (err, payload) => {
    if (err) {
      return res.status(403).end();
    }
    // Attach the username and type for downstream lookups:
    (req as any).userId = (payload as any).username;
    (req as any).userType = (payload as any).type;
    next();
  });
}

/** helper to sign & return a JWT for a given username */
function generateAccessToken(username: string, type: string): Promise<string> {
  return new Promise((resolve, reject) =>
    jwt.sign(
      { username, type },
      TOKEN_SECRET,
      { expiresIn: "1d" },
      (err, token) => (err ? reject(err) : resolve(token!))
    )
  );
}

// Register: create credentials + create a User record
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (typeof username !== "string" || typeof password !== "string") {
    return res.status(400).send("Invalid input");
  }

  try {
    // Create credentials (username/password) in your credential store:
    await credentials.create(username, password, "user");

    // Create a matching User record in MongoDB
    await Users.create({
      id: username,
      name: username,
      tocAccepted: false,
      active: true,
      deletedAt: undefined,
    });

    // Issue a JWT and return it:
    const token = await generateAccessToken(username, "user");
    return res.status(201).json({ token });
  } catch (err: any) {
    return res.status(409).json({ error: err.message });
  }
});

// Login: verify credentials
router.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (typeof username !== "string" || typeof password !== "string") {
    return res.status(400).send("Invalid input");
  }

  try {
    await credentials.verify(username, password);
    console.log(`User ${username} authenticated successfully`);
    const type = await credentials.getType(username);
    console.log(`User ${username} logged in with type ${type}`);
    const token = await generateAccessToken(username, type);
    return res.status(200).json({ token });
  } catch {
    return res.status(401).send("Unauthorized");
  }
});

// Fetch current user (protected by authenticateUser)
router.get(
  "/me",
  authenticateUser,
  async (req: Request, res: Response) => {
    try {
      const username = (req as any).userId as string;
      const user = await Users.get(username);
      if (!user) {
        return res.status(404).send("User not found");
      }
      return res.json(user);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }
);

export default router;
