const fs = require('fs');

const statuses = ['Pending', 'Delivered', 'Returned'];
const products = [
  'Bluetooth Speaker', 'Wireless Mouse', 'Tablet', 'Smart Watch', 'Camera',
  'Laptop', 'Power Bank', 'Keyboard', 'Monitor', 'LED Light', 'Microphone',
  'Router', 'Pendrive', 'HDMI Cable', 'Gaming Controller', 'Webcam',
  'USB Cable', 'Projector', 'VR Headset', 'Charger'
];

const customers = Array.from({ length: 25 }, (_, i) => ({
  customerId: `C${String(i + 1).padStart(3, '0')}`,
  name: `Customer${i + 1}`
}));

const orders = [];

for (let i = 1; i <= 2500; i++) {
  const customer = customers[Math.floor(Math.random() * customers.length)];
  const product = products[Math.floor(Math.random() * products.length)];
  const status = statuses[Math.floor(Math.random() * statuses.length)];

  orders.push({
    orderId: `${1000 + i}`,
    customerId: customer.customerId,
    customer: customer.name,
    productId: `P${String(Math.floor(Math.random() * 100) + 1).padStart(3, '0')}`,
    product: product,
    status: status
  });
}

fs.writeFileSync('orders.json', JSON.stringify(orders, null, 2));
console.log('✅ 2500 orders saved to orders.json');
