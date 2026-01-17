import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '../../.env' });

// Import routes
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import addressRoutes from './routes/addresses';
import vendorRoutes from './routes/vendors';
import cleaningRoutes from './routes/cleaning';
import handymanRoutes from './routes/handyman';
import beautyRoutes from './routes/beauty';
import groceryRoutes from './routes/groceries';
import rentalRoutes from './routes/rentals';
import caregivingRoutes from './routes/caregiving';
import bookingRoutes from './routes/bookings';
import orderRoutes from './routes/orders';
import cartRoutes from './routes/cart';
import reviewRoutes from './routes/reviews';
import paymentRoutes from './routes/payments';
import chatRoutes from './routes/chat';
import notificationRoutes from './routes/notifications';
import reportRoutes from './routes/reports';

const app = express();
const PORT = process.env.API_PORT || 3001;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3002',
    'http://localhost:3003',
    'http://localhost:8081',
    'exp://localhost:8081',
  ],
  credentials: true,
}));

// Rate limiting
// Only enable in production to avoid accidental lock-outs during local development / e2e testing.
if (process.env.NODE_ENV === 'production') {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: { error: 'Too many requests, please try again later.' },
  });
  app.use('/api/', limiter);
}

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan('dev'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/addresses', addressRoutes);
app.use('/api/v1/vendors', vendorRoutes);
app.use('/api/v1/services/cleaning', cleaningRoutes);
app.use('/api/v1/services/handyman', handymanRoutes);
app.use('/api/v1/services/beauty', beautyRoutes);
app.use('/api/v1/services/groceries', groceryRoutes);
app.use('/api/v1/services/rentals', rentalRoutes);
app.use('/api/v1/services/caregiving', caregivingRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/chat', chatRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/reports', reportRoutes);

// Also mount service routes directly (without /services/ prefix) for frontend compatibility
app.use('/api/v1/cleaning', cleaningRoutes);
app.use('/api/v1/handyman', handymanRoutes);
app.use('/api/v1/beauty', beautyRoutes);
app.use('/api/v1/groceries', groceryRoutes);
app.use('/api/v1/rentals', rentalRoutes);
app.use('/api/v1/caregiving', caregivingRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

app.listen(PORT, () => {
  console.log(`🚀 DoHuub API running on http://localhost:${PORT}`);
  console.log(`📚 Health check: http://localhost:${PORT}/health`);
});

export default app;

