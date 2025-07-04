const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

// ✅ Middleware
app.use(cors());
app.use(express.json()); // Parse JSON body from frontend

// ✅ Load orders from JSON file
const dataPath = path.join(__dirname, 'orders.json');
function readOrders() {
  const data = fs.readFileSync(dataPath, 'utf-8');
  return JSON.parse(data);
}

// ✅ Paginate results
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

// ✅ Home route
app.get('/', (req, res) => {
  res.send('✅ Order Tracking API is running successfully!');
});

// ✅ Login route
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  console.log('🛂 Login Attempt:', { username, password });

  if (username === 'admin' && password === 'admin123') {
    return res.json({
      success: true,
      token: 'fake-jwt-token',
      user: 'admin',
    });
  }

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

// ✅ Search orders
app.get('/o/search', (req, res) => {
  const { customerId, productId, status, page } = req.query;
  const pageNum = parseInt(page) || 1;

  let orders = readOrders();

  console.log("🔍 Search Params:", { customerId, productId, status, page: pageNum });

  if (customerId) {
    orders = orders.filter(o => String(o.customerId) === String(customerId));
    console.log(`🔎 After customerId filter (${customerId}): ${orders.length}`);
  }

  if (productId) {
    orders = orders.filter(o => String(o.productId) === String(productId));
    console.log(`🔎 After productId filter (${productId}): ${orders.length}`);
  }

  if (status) {
    orders = orders.filter(o => o.status.toLowerCase() === status.toLowerCase());
    console.log(`🔎 After status filter (${status}): ${orders.length}`);
  }

  console.log(`✅ Final matched orders: ${orders.length}`);

  res.json(paginate(orders, pageNum));
});

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
