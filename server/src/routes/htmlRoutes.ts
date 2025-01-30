import path from "node:path";
import { fileURLToPath } from "node:url";
import { Router, type Request, type Response } from "express";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = Router();

// TODO: Define route to serve index.html
// I wrote this before it was available as a solution on the repo
// router.get("/", (_req: Request, res: Response) => {
//   res.sendFile(path.join(__dirname, "client", "index.html"));
// });

// * Define route to serve index.html
router.get('*', (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../../../client/dist/index.html'));
});

export default router;