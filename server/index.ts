import express from 'express';
import cors from 'cors';
import productsRouter from './routes/products';
import historyRouter from './routes/history';
import budgetRouter from './routes/budget';
import couponsRouter from './routes/coupons';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/products', productsRouter);
app.use('/api/history', historyRouter);
app.use('/api/budget', budgetRouter);
app.use('/api/coupons', couponsRouter);

app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});
