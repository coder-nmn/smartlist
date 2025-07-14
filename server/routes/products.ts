import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';

const router = express.Router();

const dataPath = path.join(__dirname, '../../data/products.json');

router.get('/', (req: Request, res: Response) => {
  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read products data' });
    }
    const products = JSON.parse(data);
    res.json(products);
  });
});

router.get('/search', (req: Request, res: Response) => {
  const query = req.query.q?.toString().toLowerCase() || '';
  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read products data' });
    }
    const products = JSON.parse(data);
    const filtered = products.filter((p: any) =>
      p.name.toLowerCase().includes(query) || p.brand.toLowerCase().includes(query)
    );
    res.json(filtered);
  });
});

export default router;
