import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';

const router = express.Router();

const dataPath = path.join(__dirname, '../../data/coupons.json');

router.get('/', (req: Request, res: Response) => {
  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read coupons data' });
    }
    const coupons = JSON.parse(data);
    res.json(coupons);
  });
});

router.post('/apply', (req: Request, res: Response) => {
  const { code, cartTotal } = req.body;
  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read coupons data' });
    }
    const coupons = JSON.parse(data);
    const coupon = coupons.find((c: any) => c.code === code);
    if (!coupon) {
      return res.status(404).json({ error: 'Coupon not found' });
    }
    if (coupon.minPurchase && cartTotal < coupon.minPurchase) {
      return res.status(400).json({ error: 'Cart total does not meet minimum purchase requirement' });
    }
    // For demo, calculate discount amount
    let discount = 0;
    if (coupon.discountType === 'fixed') {
      discount = coupon.discountValue;
    } else if (coupon.discountType === 'percentage') {
      discount = (cartTotal * coupon.discountValue) / 100;
    }
    const newTotal = cartTotal - discount;
    res.json({ newTotal: newTotal > 0 ? newTotal : 0, discount });
  });
});

export default router;
