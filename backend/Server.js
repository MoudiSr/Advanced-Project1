import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mysql from "mysql2";
import cors from "cors";

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// =======================
// MYSQL CONNECTION
// =======================
const db = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: Number(process.env.MYSQL_PORT),       // convert port string → number
  ssl: { rejectUnauthorized: false }          // allow Railway self-signed certificate
});

db.connect((err) => {
  if (err) {
    console.error("DB connection error:", err);
  } else {
    console.log("Connected to Railway MySQL ✅");
  }
});

// =======================
// LOGIN
// =======================
app.post("/login", (req, res) => {
  const email = req.body.email?.trim();
  const password = req.body.password?.trim();
 

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const q = `
    SELECT id, email, role
    FROM users
    WHERE email = ? AND password = ?
    LIMIT 1
  `;

  db.query(q, [email, password], (err, data) => {
    if (err) {
      console.error("Login query error:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (data.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    return res.json(data[0]);
  });
});


// =======================
// CREATE ORDER
// =======================
app.post("/orders", (req, res) => {
  const { user_id, items, total } = req.body;

  const q1 = "INSERT INTO orders (user_id, total, status) VALUES (?, ?, 'Pending')";
  db.query(q1, [user_id, total], (err, result) => {
    if (err) return res.status(500).json(err);

    const orderId = result.insertId;
    const values = items.map(item => [orderId, item.name, item.price, item.quantity]);
    const q2 = "INSERT INTO order_items (order_id, item_name, price, quantity) VALUES ?";

    db.query(q2, [values], (err2) => {
      if (err2) return res.status(500).json(err2);
      return res.json({ message: "Order created successfully" });
    });
  });
});

// =======================
// GET ALL ORDERS
// =======================
app.get("/orders", (req, res) => {
  const q1 = `
    SELECT o.id, o.status, o.total, o.created_at,
           u.email AS customer
    FROM orders o
    JOIN users u ON o.user_id = u.id
    ORDER BY o.created_at DESC
  `;

  db.query(q1, (err, orders) => {
    if (err) return res.status(500).json(err);

    const orderIds = orders.map(o => o.id);
    if (orderIds.length === 0) return res.json([]);

    const q2 = "SELECT * FROM order_items WHERE order_id IN (?)";
    db.query(q2, [orderIds], (err2, items) => {
      if (err2) return res.status(500).json(err2);

      const result = orders.map(order => ({
        ...order,
        items: items.filter(i => i.order_id === order.id)
      }));

      return res.json(result);
    });
  });
});

// =======================
// UPDATE ORDER
// =======================
app.put("/orders/:id", (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  const q = "UPDATE orders SET status = ? WHERE id = ?";
  db.query(q, [status, id], (err) => {
    if (err) return res.status(500).json(err);
    return res.json({ message: "Order updated" });
  });
});

// =======================
// DELETE ORDER
// =======================
app.delete("/orders/:id", (req, res) => {
  const { id } = req.params;

  const q = "DELETE FROM orders WHERE id = ?";
  db.query(q, [id], (err) => {
    if (err) return res.status(500).json(err);
    return res.json({ message: "Order deleted" });
  });
});

// =======================
const PORT = process.env.PORT || 5000; // use Railway port or fallback to 5000 locally
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});

