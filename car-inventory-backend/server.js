const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // your MySQL username
  password: 'Manu123', // your MySQL password
  database: 'car_inventory'
});

db.connect((err) => {
  if (err) throw err;
  console.log('MySQL Connected...');
});

// Get all items
app.get('/api/items', (req, res) => {
  const sql = `
    SELECT i.*, 
      GROUP_CONCAT(po.id) AS purchase_order_ids, 
      GROUP_CONCAT(so.id) AS sales_order_ids 
    FROM items i
    LEFT JOIN purchase_orders po ON i.id = po.item_id
    LEFT JOIN sales_orders so ON i.id = so.item_id
    GROUP BY i.id
  `;
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
