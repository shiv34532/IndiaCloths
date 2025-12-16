# 🚀 PRODUCTION CONFIGURATION GUIDE
**Indian Cloths E-Commerce Platform**  
**Version:** 2.1.0  
**Date:** December 16, 2025

---

## 📋 TABLE OF CONTENTS

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Backend Setup (Node.js + Express)](#backend-setup)
3. [Database Configuration (MongoDB)](#database-configuration)
4. [Frontend Optimization](#frontend-optimization)
5. [Payment Gateway Integration](#payment-gateway-integration)
6. [Email & SMS Services](#email--sms-services)
7. [Hosting & Deployment](#hosting--deployment)
8. [Security Configuration](#security-configuration)
9. [Monitoring & Logging](#monitoring--logging)
10. [Testing Procedures](#testing-procedures)

---

## ✅ PRE-DEPLOYMENT CHECKLIST

### Frontend Files Status
```
✅ index.html - Homepage (READY)
✅ products.html - Product Listing (READY)
✅ cart.html - Shopping Cart (READY)
✅ checkout.html - Order Checkout (READY)
✅ auth.html - Authentication (READY)
✅ admin.html - Admin Dashboard (READY)
✅ my-orders.html - Order Tracking (READY)
✅ product-details.html - Product Details (READY)
✅ about.html - About Us (READY)
✅ contact.html - Contact Us (READY)
✅ register.html - Registration (LEGACY - READY)
✅ login.html - Login (LEGACY - READY)
✅ products.json - Product Database (READY)
```

### Documentation Status
```
✅ AUDIT_REPORT.md - Complete System Audit (NEW)
✅ README.md - Full Documentation (READY)
✅ STATUS.md - System Status (READY)
✅ ARCHITECTURE.md - System Design (READY)
✅ QUICK_REFERENCE.md - Developer Guide (READY)
```

---

## 🔧 BACKEND SETUP

### Step 1: Initialize Node.js Project

**Create folder structure:**
```bash
mkdir backend
cd backend
npm init -y
```

**Install dependencies:**
```bash
npm install express mongoose dotenv cors bcryptjs jsonwebtoken multer
npm install --save-dev nodemon
```

### Step 2: Create Configuration Files

**File: `.env`**
```env
# Server
PORT=5000
NODE_ENV=production
SERVER_URL=https://api.indiacloths.com

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/indiacloths
DB_NAME=indiacloths

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRE=7d

# Admin
ADMIN_PASSWORD=admin123
ADMIN_SECRET=admin_secret_key_change_in_production

# Payment Gateway
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Email Service
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.your_sendgrid_key
EMAIL_FROM=noreply@indiacloths.com

# SMS Service
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE=+1234567890

# AWS/Cloud Storage
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_S3_BUCKET=indiacloths-uploads
AWS_REGION=us-east-1

# Frontend URL
FRONTEND_URL=https://indiacloths.com
```

**File: `package.json` (Update scripts)**
```json
{
  "name": "indiacloths-backend",
  "version": "1.0.0",
  "description": "Indian Cloths E-Commerce Backend",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.0.0",
    "dotenv": "^16.0.3",
    "cors": "^2.8.5",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.0",
    "multer": "^1.4.5-lts.1"
  },
  "devDependencies": {
    "nodemon": "^2.0.20"
  }
}
```

### Step 3: Create Server File

**File: `server.js`**
```javascript
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB error:', err));

// Routes (To be added)
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/admin', require('./routes/admin'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
```

---

## 💾 DATABASE CONFIGURATION

### MongoDB Atlas Setup

**Step 1: Create MongoDB Atlas Account**
```
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free account
3. Create organization and project
4. Create M0 (free) cluster
5. Add user with database access
6. Get connection string
```

### Database Models

**File: `models/User.js`**
```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, unique: true, sparse: true },
  phone: { type: String, unique: true, sparse: true },
  password: { type: String },
  emailVerified: { type: Boolean, default: false },
  phoneVerified: { type: Boolean, default: false },
  profilePicture: String,
  addresses: [{
    type: String,
    city: String,
    state: String,
    pincode: String,
    isDefault: Boolean
  }],
  createdAt: { type: Date, default: Date.now },
  lastLogin: Date
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if(!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model('User', userSchema);
```

**File: `models/Order.js`**
```javascript
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [{
    productId: mongoose.Schema.Types.ObjectId,
    name: String,
    price: Number,
    quantity: Number,
    color: String,
    size: String
  }],
  subtotal: Number,
  tax: Number,
  shipping: Number,
  total: Number,
  customer: {
    name: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    pincode: String
  },
  paymentMethod: String,
  paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  orderStatus: { 
    type: String, 
    enum: ['new', 'packed', 'shipped', 'delivered', 'cancelled'], 
    default: 'new' 
  },
  trackingNumber: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
```

**File: `models/Product.js`**
```javascript
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  category: String,
  image: String,
  images: [String],
  sizes: [String],
  colors: [String],
  stock: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  reviews: [{
    userId: mongoose.Schema.Types.ObjectId,
    userName: String,
    rating: Number,
    comment: String,
    date: Date
  }],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
```

---

## 🎨 FRONTEND OPTIMIZATION

### Step 1: Update API Endpoints

**Create: `fronted/api-config.js`**
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.indiacloths.com/api';

export const endpoints = {
  // Auth
  REGISTER: `${API_BASE_URL}/auth/register`,
  LOGIN: `${API_BASE_URL}/auth/login`,
  PHONE_OTP: `${API_BASE_URL}/auth/phone-otp`,
  VERIFY_OTP: `${API_BASE_URL}/auth/verify-otp`,
  
  // Products
  GET_PRODUCTS: `${API_BASE_URL}/products`,
  GET_PRODUCT: `${API_BASE_URL}/products/:id`,
  
  // Orders
  CREATE_ORDER: `${API_BASE_URL}/orders`,
  GET_ORDERS: `${API_BASE_URL}/orders`,
  GET_ORDER: `${API_BASE_URL}/orders/:id`,
  UPDATE_ORDER_STATUS: `${API_BASE_URL}/orders/:id/status`,
  
  // Admin
  ADMIN_LOGIN: `${API_BASE_URL}/admin/login`,
  GET_ALL_ORDERS: `${API_BASE_URL}/admin/orders`
};

export async function apiCall(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };
  
  const token = localStorage.getItem('auth_token');
  if(token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(endpoint, {
    ...options,
    headers
  });
  
  if(!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  
  return response.json();
}
```

### Step 2: Update to Use Backend API

**Update: `fronted/cart.html` (Example)**
```javascript
// Replace localStorage with API calls
async function getCart() {
  try {
    const response = await fetch(endpoints.GET_CART, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
    });
    return await response.json();
  } catch(error) {
    console.error('Error fetching cart:', error);
    return [];
  }
}

async function addToCart(item) {
  try {
    const response = await fetch(endpoints.ADD_TO_CART, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      },
      body: JSON.stringify(item)
    });
    return await response.json();
  } catch(error) {
    console.error('Error adding to cart:', error);
  }
}
```

### Step 3: Environment Variables

**Create: `fronted/.env`**
```
REACT_APP_API_URL=https://api.indiacloths.com/api
REACT_APP_PAYMENT_KEY=rzp_live_xxxxx
REACT_APP_ENVIRONMENT=production
```

---

## 💳 PAYMENT GATEWAY INTEGRATION

### Razorpay Integration

**Step 1: Setup Razorpay Account**
```
1. Go to https://razorpay.com
2. Sign up for merchant account
3. Complete KYC verification
4. Get API keys (Key ID & Secret)
5. Add to .env file
```

**File: `backend/routes/payment.js`**
```javascript
const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create order
router.post('/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;
    
    const options = {
      amount: Math.round(amount * 100), // Convert to paise
      currency,
      receipt,
      payment_capture: 1 // Auto-capture
    };
    
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch(error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify payment
router.post('/verify-payment', async (req, res) => {
  try {
    const { orderId, paymentId, signature } = req.body;
    
    const crypto = require('crypto');
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(orderId + '|' + paymentId);
    const generatedSignature = hmac.digest('hex');
    
    if(generatedSignature === signature) {
      res.json({ success: true, message: 'Payment verified' });
    } else {
      res.status(400).json({ error: 'Invalid signature' });
    }
  } catch(error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

**Frontend: Update checkout.html**
```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>

<script>
  async function initiatePayment(orderId, amount) {
    try {
      // Create order in backend
      const orderResponse = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, receipt: orderId })
      });
      
      const order = await orderResponse.json();
      
      const options = {
        key: process.env.RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: 'INR',
        name: 'Indian Cloths',
        description: 'Order #' + orderId,
        image: '/logo.png',
        order_id: order.id,
        handler: async function(response) {
          // Verify payment
          const verifyResponse = await fetch('/api/payment/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderId: order.id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature
            })
          });
          
          const result = await verifyResponse.json();
          if(result.success) {
            alert('Payment successful!');
            // Update order status
            saveOrderToDatabase(orderId);
          }
        },
        prefill: {
          email: userEmail,
          contact: userPhone
        },
        theme: { color: '#d4a574' }
      };
      
      const rzp = new Razorpay(options);
      rzp.open();
    } catch(error) {
      console.error('Payment error:', error);
      alert('Payment failed: ' + error.message);
    }
  }
</script>
```

---

## 📧 EMAIL & SMS SERVICES

### SendGrid Integration

**File: `backend/services/email.js`**
```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendOrderConfirmation(email, orderDetails) {
  const msg = {
    to: email,
    from: process.env.EMAIL_FROM,
    subject: `Order Confirmation #${orderDetails.orderId}`,
    html: `
      <h2>Order Confirmed!</h2>
      <p>Your order has been placed successfully.</p>
      <p><strong>Order ID:</strong> ${orderDetails.orderId}</p>
      <p><strong>Total Amount:</strong> ₹${orderDetails.total}</p>
      <p>Expected Delivery: 5-7 working days</p>
      <p>Track your order: <a href="${process.env.FRONTEND_URL}/track/${orderDetails.orderId}">Click here</a></p>
    `
  };
  
  return sgMail.send(msg);
}

async function sendShippingNotification(email, trackingNumber) {
  const msg = {
    to: email,
    from: process.env.EMAIL_FROM,
    subject: 'Your order has been shipped!',
    html: `
      <h2>Order Shipped!</h2>
      <p>Your order is on the way.</p>
      <p><strong>Tracking Number:</strong> ${trackingNumber}</p>
      <p>Track here: <a href="https://tracking.example.com/${trackingNumber}">Click here</a></p>
    `
  };
  
  return sgMail.send(msg);
}

module.exports = { sendOrderConfirmation, sendShippingNotification };
```

### Twilio SMS Integration

**File: `backend/services/sms.js`**
```javascript
const twilio = require('twilio');

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

async function sendOTP(phoneNumber, otp) {
  return client.messages.create({
    body: `Your OTP for Indian Cloths is: ${otp}. Valid for 5 minutes.`,
    from: process.env.TWILIO_PHONE,
    to: phoneNumber
  });
}

async function sendOrderSMS(phoneNumber, orderId) {
  return client.messages.create({
    body: `Your order #${orderId} has been placed. Track here: ${process.env.FRONTEND_URL}/track/${orderId}`,
    from: process.env.TWILIO_PHONE,
    to: phoneNumber
  });
}

module.exports = { sendOTP, sendOrderSMS };
```

---

## 🌐 HOSTING & DEPLOYMENT

### Option 1: Vercel (Frontend)

**Step 1: Connect GitHub**
```bash
# Push code to GitHub
git init
git add .
git commit -m "Initial commit"
git push -u origin main
```

**Step 2: Deploy on Vercel**
```
1. Go to https://vercel.com
2. Sign in with GitHub
3. Select repository
4. Click Deploy
5. Add environment variables
6. Configure domain
```

### Option 2: Railway (Backend)

**Step 1: Initialize Railway**
```bash
npm install -g railway
railway login
railway init
```

**Step 2: Configure Railway**
```yaml
# railway.json
{
  "build": {
    "builder": "nixpacks"
  },
  "deploy": {
    "numReplicas": 1,
    "startCommand": "npm start"
  }
}
```

**Step 3: Deploy**
```bash
railway up
railway domain # Get your domain
```

### Option 3: AWS (Full Stack)

**S3 for Frontend:**
```bash
# Build frontend
npm run build

# Upload to S3
aws s3 sync dist/ s3://indiacloths-frontend/

# CloudFront distribution
# Set origin to S3 bucket
# Configure HTTPS
```

**EC2 for Backend:**
```bash
# Create EC2 instance
# Install Node.js: sudo apt-get install nodejs npm
# Clone repo: git clone <repo>
# Install deps: npm install
# Start with PM2: npm install -g pm2 && pm2 start server.js
```

---

## 🔐 SECURITY CONFIGURATION

### HTTPS/SSL Setup

**Using Let's Encrypt (Free):**
```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --nginx -d indiacloths.com

# Auto-renewal
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

### Security Headers

**File: `backend/middleware/security.js`**
```javascript
module.exports = (req, res, next) => {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Prevent MIME sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // XSS Protection
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // HSTS (force HTTPS)
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  
  // CSP (Content Security Policy)
  res.setHeader('Content-Security-Policy', 
    "default-src 'self'; script-src 'self' cdn.jsdelivr.net checkout.razorpay.com; style-src 'self' 'unsafe-inline'"
  );
  
  next();
};
```

### Rate Limiting

**File: `backend/middleware/rateLimit.js`**
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // Limit login attempts
  skipSuccessfulRequests: true
});

module.exports = { limiter, authLimiter };
```

---

## 📊 MONITORING & LOGGING

### Google Analytics

**Add to index.html:**
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Error Logging (Sentry)

**Backend:**
```javascript
const Sentry = require("@sentry/node");

Sentry.init({ dsn: process.env.SENTRY_DSN });
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.errorHandler());
```

**Frontend:**
```html
<script src="https://browser.sentry-cdn.com/7.0.0/bundle.min.js"></script>
<script>
  Sentry.init({ dsn: 'YOUR_SENTRY_DSN' });
</script>
```

---

## ✅ TESTING PROCEDURES

### Manual Testing Checklist

```
[ ] User Registration (Email)
[ ] User Registration (Phone OTP)
[ ] User Login (Email)
[ ] User Login (Phone OTP)
[ ] Browse Products
[ ] Filter Products
[ ] Add to Cart
[ ] Remove from Cart
[ ] Checkout Process
[ ] Payment Processing
[ ] Order Confirmation Email
[ ] Order SMS Notification
[ ] Track Order
[ ] Admin Login
[ ] Update Order Status
[ ] Verify Real-time Updates
[ ] Mobile Responsiveness
[ ] Cross-browser Testing
[ ] Load Testing (1000+ concurrent users)
[ ] Security Testing
```

### Automated Testing

**Jest Tests:**
```bash
npm install --save-dev jest supertest

# Create test files
# Run: npm test
```

---

## 🎉 DEPLOYMENT CHECKLIST

```
PRE-DEPLOYMENT:
☐ Code review completed
☐ All tests passing
☐ Security audit done
☐ Performance testing done
☐ Database backup taken
☐ API documentation ready
☐ Environment variables set
☐ SSL certificate installed

DEPLOYMENT:
☐ Frontend deployed to Vercel
☐ Backend deployed to Railway/AWS
☐ Database migrated to MongoDB Atlas
☐ Payment gateway configured
☐ Email service configured
☐ SMS service configured
☐ Domain configured
☐ Monitoring set up

POST-DEPLOYMENT:
☐ Smoke tests passed
☐ Users can register
☐ Orders can be placed
☐ Payments processing
☐ Emails sending
☐ SMS sending
☐ Admin dashboard working
☐ Analytics tracking
```

---

## 🚀 LAUNCH TIMELINE

| Week | Task | Status |
|------|------|--------|
| Week 1 | Backend API Development | ⏳ |
| Week 2 | Database & Integration | ⏳ |
| Week 3 | Payment Gateway & Services | ⏳ |
| Week 4 | Security & Testing | ⏳ |
| Week 5 | Deployment & Configuration | ⏳ |
| Week 6 | Launch & Monitoring | ⏳ |

---

## 📞 SUPPORT & TROUBLESHOOTING

### Common Issues & Solutions

**Issue: API timeout**
```
Solution: Increase timeout in nginx/load balancer
Add to nginx: proxy_read_timeout 300s;
```

**Issue: Database connection failing**
```
Solution: Check MongoDB Atlas IP whitelist
Add your server IP to whitelist
```

**Issue: Payment verification failed**
```
Solution: Verify Razorpay keys
Check webhook configuration
```

---

## 📚 DOCUMENTATION LINKS

- API Documentation: `/docs/api`
- User Guide: `/docs/user-guide`
- Admin Guide: `/docs/admin-guide`
- Developer Guide: `/docs/developer-guide`

---

**Created:** December 16, 2025  
**Last Updated:** December 16, 2025  
**Status:** ✅ READY FOR IMPLEMENTATION

---

**End of Configuration Guide**
