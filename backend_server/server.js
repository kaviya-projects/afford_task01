const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

// ✅ Middleware
app.use(cors());
app.use(express.json()); // Parse JSON from frontend

// ✅ Path to orders.json
const dataPath = path.join(__dirname, 'orders.json');

// ✅ Helper: Load orders from file
function readOrders() {
  const data = fs.readFileSync(dataPath, 'utf-8');
  return JSON.parse(data);
}

// ✅ Helper: Paginate array
function paginate(array, page = 1, limit = 50) {
  const start = (page - 1) * limit;
  const end = start + limit;
  return {
    total: array.length,
    page,
    limit,
    totalPages: Math.ceil(array.length / limit),
    data: array.slice(start, end),
  };
}

// ✅ Root test route
app.get('/', (req, res) => {
  res.send('✅ Order Tracking API is running successfully!');
});

// ✅ Login route
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  console.log('🛂 Login attempt received:');
  console.log('→ Username:', username);
  console.log('→ Password:', password);

  if (username === 'admin' && password === 'admin123') {
    console.log('✅ Login successful');
    return res.json({
      success: true,
      token: 'fake-jwt-token',
      user: 'admin',
    });
  }

  console.log('❌ Invalid credentials');
  return res.status(401).json({
    success: false,
    message: 'Invalid credentials',
  });
});

// ✅ Delivered orders
app.get('/o/success', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const orders = readOrders();
  const delivered = orders.filter(o => o.status.toLowerCase() === 'delivered');
  res.json(paginate(delivered, page));
});

// ✅ Pending orders
app.get('/o/pending', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const orders = readOrders();
  const pending = orders.filter(o => o.status.toLowerCase() === 'pending');
  res.json(paginate(pending, page));
});

// ✅ Returned orders
app.get('/o/returned', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const orders = readOrders();
  const returned = orders.filter(o => o.status.toLowerCase() === 'returned');
  res.json(paginate(returned, page));
});

// ✅ Search orders by customerId, productId, or status
app.get('/o/search', (req, res) => {
  const { customerId, productId, status, page } = req.query;
  const pageNum = parseInt(page) || 1;
  let orders = readOrders();

  console.log("🔍 Search query received:", { customerId, productId, status, page });

  if (customerId) {
    orders = orders.filter(o => String(o.customerId) === String(customerId));
    console.log(`🔎 Filtered by customerId (${customerId}): ${orders.length} match(es)`);
  }

  if (productId) {
    orders = orders.filter(o => String(o.productId) === String(productId));
    console.log(`🔎 Filtered by productId (${productId}): ${orders.length} match(es)`);
  }

  if (status) {
    orders = orders.filter(o => o.status.toLowerCase() === status.toLowerCase());
    console.log(`🔎 Filtered by status (${status}): ${orders.length} match(es)`);
  }

  console.log(`✅ Final filtered orders count: ${orders.length}`);

  res.json(paginate(orders, pageNum));
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
