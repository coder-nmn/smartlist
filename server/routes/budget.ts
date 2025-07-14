import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';

const router = express.Router();

const dataPath = path.join(__dirname, '../../data/users.json');

router.get('/:userId', (req: Request, res: Response) => {
  const userId = req.params.userId;
  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read users data' });
    }
    const users = JSON.parse(data);
    const user = users.find((u: any) => u.userId === userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user.budgetHistory);
  });
});

router.put('/:userId', (req: Request, res: Response) => {
  // For demo, just respond success as no DB write implemented
  res.json({ message: 'Budget updated (mock)' });
});

export default router;
